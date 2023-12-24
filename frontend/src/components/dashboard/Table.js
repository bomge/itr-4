import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faLockOpen, faTrash } from '@fortawesome/free-solid-svg-icons';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import 'primereact/resources/themes/lara-light-indigo/theme.css';

// import testData from '../../testData/users.json'

export default function Table() {
  const axios = useAxiosPrivate();
  const toast = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    axios
      .get('/users/getAll')
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 3000 });
  };
  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };
  const handleBlock = async () => {
    try {
      const ids = selectedProducts.map((product) => product.id);
      const result = await axios.post('/users/ban', { ids }, { withCredentials: true });

      axios.post('/users/checkMe');

      const updated = products.map((product) =>
        ids.includes(product.id) ? { ...product, status: 'banned' } : product
      );
      showSuccess(result.data.message);
      setProducts(updated);
    } catch (e) {
      showError(e.message);
    }
  };

  const handleUnblock = async () => {
    try {
      const ids = selectedProducts.map((product) => product.id);
      const result = await axios.post('/users/unban', { ids }, { withCredentials: true });
      axios.post('/users/checkMe');

      const updated = products.map((product) =>
        ids.includes(product.id) ? { ...product, status: 'active' } : product
      );

      showSuccess(result.data.message);
      setProducts(updated);
    } catch (e) {
      showError(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      const ids = selectedProducts.map((product) => product.id);
      const result = await axios.post('/users/delete', { ids }, { withCredentials: true });
      axios.post('/users/checkMe');

      const updated = products.filter((product) => !ids.includes(product.id));

      showSuccess(result.data.message);
      setProducts(updated);
    } catch (e) {
      showError(e.message);
    }
  };

  const toolbarLeft = () => {
    return (
      <React.Fragment>
        <Button icon={<FontAwesomeIcon icon={faBan} />} onClick={handleBlock} />
        <Button icon={<FontAwesomeIcon icon={faLockOpen} />} onClick={handleUnblock} />
        <Button icon={<FontAwesomeIcon icon={faTrash} />} onClick={handleDelete} />
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const severityMap = {
      active: 'success',
      banned: 'danger'
    };

    const severity = severityMap[rowData.status];
    return <Tag value={rowData.status} severity={severity} />;
  };

  return (
    <>
      <Toast ref={toast} />
      <Toolbar className="p-mb-4" left={toolbarLeft}></Toolbar>
      <DataTable
        value={products}
        paginator
        rows={7}
        rowsPerPageOptions={[5, 10, 25, 50]}
        selectionMode={true}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}>
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        {/* <Column field="id" header="Id"></Column> */}
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="regDate" header="Register"></Column>
        <Column field="lastLogin" header="Logined"></Column>
        <Column field="status" header="status" body={statusBodyTemplate}></Column>
      </DataTable>
    </>
  );
}
