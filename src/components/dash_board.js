import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../components/dashboard.css";
import logo from '../components/images/logo-png.png';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../components/AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Template from '../components/InvoiceTemplate';

function DashBoard() {
    const [rows, setRows] = useState([{ itemName: '', unit: '', price: '', amount: '' }]);
    const [invoices, setInvoices] = useState([]);
    const { user } = useContext(AuthContext);
    const [view, setView] = useState('dashboard');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [email, setEmailId] = useState('');
    const [phone, setPhone] = useState('');
    const [customername, setcustomername] = useState([]);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [selectedsearchInvoice, setSelectedSearchInvoice] = useState(false);
    const [searchdropdownVisible, setsearchDropdownVisible] = useState(false);
    const [showInvoiceTemplate, setShowInvoiceTemplate] = useState(false);
    const [emailErrorSpan, setemailErrorSpan] = useState(false);
    const [firstNameErrorSpan, setfirstnameErrorSpan] = useState(false);
    const { logout } = useContext(AuthContext);
    const [subtotal, setSubtotal] = useState(0);
    const [NetTotalAmt, setNetTotalAmt] = useState(0);
    const [sgstRate, setSGSTRate] = useState(0);
    const [cgstRate, setCGSTRate] = useState(0);
    const [invoiceData, setInvoiceData] = useState([]);
    const templateRef = useRef();
    //const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    const initialState = {
        selectedddValue: 'Select Customer Name',
        tableData: [{ id: 1, itemName: '', unit: '', price: '', amount: '' }],

    };
    const [tableData, setTableData] = useState(initialState.tableData);
    const [selectedddValue, setSelectedddValue] = useState(initialState.selectedddValue);

    const addNewRow = () => {
        const newRow = { id: Date.now(), itemName: '', unit: '', price: '', amount: '' };
        setTableData([...tableData, newRow]);
    };
    const handleInputChange = (id, field, value) => {
        const updatedData = tableData.map(row => {
            if (row.id === id) {
                let updatedrow = { ...row, [field]: value };
                if (field === "unit" || field === "price") {
                    const quantity = field === 'unit' ? value : row.unit;
                    const price = field === 'price' ? value : row.price;
                    updatedrow.amount = quantity && price ? (quantity * price).toFixed(2) : '';

                }
                return updatedrow;
            }
            return row;
        });
        setTableData(updatedData);
        updateSubtotal(updatedData);
    };

    const deleteRow = (id) => {
        console.log(id);
        setTableData(tableData.filter(row => row.id !== id));
        updateSubtotal(tableData.filter(row => row.id !== id));
    };

    // get invoice data for view dashboard start
    const getInvoiceData = () => {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        axios.get('http://localhost:7116/api/controller/GetInvoicesByGSTNo', {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(response => {
                setInvoices(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }
    // useEffect(() => {
    //     const token = localStorage.getItem('user');
    //     if (!token) {
    //         navigate('/');
    //     }
    //     else {
    //         getInvoiceData();
    //     }

    // }, [navigate]);
    useEffect(() => {

        getInvoiceData();


    }, [user.token]);

    // window.addEventListener("beforeunload", (event) => {

    //     getInvoiceData();

    // })
    // window.addEventListener("unload", (event) => {
    //     getInvoiceData();
    // })

    const renderInvoices = () => {
        if (!invoices) {
            return (
                <tr>
                    <td colSpan="4">No record found</td>
                </tr>
            );
        }

        if (!invoices.success || !invoices.msg) {
            return (
                <tr>
                    <td colSpan="4">No record found</td>
                </tr>
            );
        }

        const invoicesToDisplay = selectedsearchInvoice ? filteredInvoices : invoices.msg;

        return invoicesToDisplay.map((invoice, index) => {
            console.log('Invoice:', invoice);
            console.log('Invoice Amount:', invoice.amount);
            const invoiceDate = new Date(invoice.invoiceDate);
            const formattedDate = invoiceDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });

            return (
                <tr key={index}>
                    <td>
                        <input type="checkbox"
                            //checked={isChecked}
                            checked={selectedInvoices.includes(invoice.invoiceNo)}
                            onChange={() => handleSelectInvoice(invoice.invoiceNo)}
                        />
                    </td>
                    <td>{formattedDate}</td>
                    <td>{invoice.customerName}</td>
                    <td>{invoice.invoiceNo}</td>
                    <td>₹ {invoice.netAmt}</td>
                    <td class="text-end">
                        {/* <button type="button" class="btn btn-sm btn-square btn-danger">
                            <i class="bi bi-trash"></i>
                        </button> */}
                    </td>
                </tr>
            );
        });
    };
    const handleSelectInvoice = (invoiceNo) => {
        console.log(invoiceNo);
        if (selectedInvoices.includes(invoiceNo)) {
            setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceNo));
        } else {
            setSelectedInvoices([...selectedInvoices, invoiceNo]);
        }
    };

    // get invoice data for view dashboard end

    //side nav start
    const handleViewChange = (view) => {
        setView(view);
    };
    //side nav end

    //populate invoice customername dropdown start

    const handleSelect = (value) => {
        setSelectedddValue(value);
    };

    const getCustomerName = () => {
        // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        axios.get('http://localhost:7116/api/controller/GetCustomerNameByGstNo', {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(response => {
                setcustomername(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }
    useEffect(() => {

        getCustomerName();
    }, [user.token]);

    const rendercustomerName = () => {
        if (!customername) {
            return (
                <li>No Record</li>
            );
        }

        if (!customername.success || !customername.msg) {
            return (
                <li>No Record</li>
            );
        }

        return customername.msg.map((customer_name, index) => {
            return (
                <li><a href="#" key={index} class="dropdown-item" onClick={() => handleSelect(customer_name)}>{customer_name}</a>

                </li>
            );
        });
    };
    //populate invoice customername dropdown end

    //customer creation start

    const validateEmail = (email) => {

        // custom email regex
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || email.length === 0) {
            return 'Email is required';
        }

        if (!regex.test(email)) {
            return '*Invalid email format';
        }


        return null;
    }

    const sbt_customerdata = async (event) => {

        event.preventDefault();
        //setLoading(true);
        const emailError = validateEmail(email);
        if (emailError) {
            setemailErrorSpan(emailError);
        }
        else {
            setemailErrorSpan('');
            try {

                //https://localhost:7116/api/controller/login?gstNo=GST_12345
                const response = await axios.post('http://localhost:7116/api/controller/CreateCustomer', {
                    FirstName: firstName,
                    LastName: lastName,
                    AddressLine: address,
                    States: state,
                    City: city,
                    EmailId: email,
                    Pincode: pincode,
                    Phone: phone,
                },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                );

                if (response.status === 200) {
                    // Set token in Authorization header for all subsequent requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
                    alert('Customer Created');
                    console.log('Customer created successfully');
                    setFirstName('');
                    setLastName('');
                    setAddress('');
                    setState('');
                    setCity('');
                    setPincode('');
                    setEmailId('');
                    setPhone('');
                    getCustomerName();

                } else {
                    // Handle login failure
                    console.log('Customer creation failed');
                    //setShowAlert(true);
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Customer creation failed");

                //setShowAlert(true);
            } finally {
                //setLoading(false);
            }
        }

        //}

    };
    //customer creation end

    //invoice creation start

    const addNewItemRow = () => {
        const newRow = { id: tableData.length + 1, itemName: '', quantity: 0, price: 0, amount: 0 };
        setTableData([...tableData, newRow]);
    };
    const deleteItemRow = id => {
        const updatedData = tableData.filter(row => row.id !== id);
        setTableData(updatedData);
    };

    const handledropdowmChange = (event) => {
        setSelectedddValue(event.target.value)

    };

    const updateSubtotal = (data) => {
        const total = data.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0);
        setSubtotal(total.toFixed(2));
        netTotalAmount(sgstRate, cgstRate, total);
    };

    const netTotalAmount = (sgstRate, cgstRate, newSubtotal = subtotal) => {

        setSGSTRate(sgstRate);
        setCGSTRate(cgstRate);
        const sgstAmt = parseFloat(newSubtotal || 0) * (parseFloat(sgstRate) / 100 || 0);
        const cgstAmt = parseFloat(newSubtotal || 0) * (parseFloat(cgstRate) / 100 || 0);
        const netamount = parseFloat(newSubtotal) + parseFloat(sgstAmt) + parseFloat(cgstAmt);
        setNetTotalAmt(netamount.toFixed(2));
    };

    const sbt_invoicedata = async (event) => {
        event.preventDefault();
        try {

            if (selectedddValue === 'Select Customer Name') {
                console.log(selectedddValue);
                alert('Please select customer name!')
            }
            else {
                const response = await axios.post('http://localhost:7116/api/controller/CreateInvoice', {
                    ///apiData
                    customerName: selectedddValue,
                    subtotal: subtotal,
                    sgstRate: sgstRate,
                    cgstRate: cgstRate,
                    totalAmt: NetTotalAmt,
                    details: tableData.map(({ itemName, unit, price, amount }) => ({
                        itemName: itemName,
                        quantity: unit,
                        price: price,
                        Amount: amount
                    }))

                },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                );

                if (response.status === 200) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
                    alert('Invoice Created');
                    console.log('Invoice created successfully');
                    setSelectedddValue(initialState.selectedddValue);
                    setTableData(initialState.tableData);
                    setSubtotal('');
                    setSGSTRate('');
                    setCGSTRate('');

                    setNetTotalAmt('');


                    getInvoiceData();

                } else {
                    console.log('Invoice creation failed');
                    alert("Invoice creation failed");

                }
            }

        } catch (error) {
            console.error('Error:', error);
            alert("Invoice creation failed");

            // setShowAlert(true);
        } finally {
            // setLoading(false);
        }
    };
    //invocie creation end

    //view invoice checkbox selection start
    const [selectAll, setSelectAll] = useState(false);
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedInvoices([]);
        } else {
            if (invoices && invoices.msg) {
                setSelectedInvoices(invoices.msg.map(invoice => invoice.invoiceNo));
            } else {
                setSelectedInvoices([]);
            }
        }
        setSelectAll(!selectAll);
    };
    //view invoice checkbox selection end

    //searchbox customername selection for invoice start

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    useEffect(() => {
        if (invoices && invoices.msg) {
            if (searchQuery) {
                const filtered = invoices.msg.filter(invoice =>
                    invoice.customerName.toLowerCase().startsWith(searchQuery.toLowerCase())
                );
                setFilteredInvoices(filtered);
            } else {
                setFilteredInvoices(invoices.msg);
            }
        }
    }, [searchQuery, invoices]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setsearchDropdownVisible(e.target.value.length > 0);
        setSelectedSearchInvoice(null);
    };

    const handleInvoiceSelect = (customerName) => {
        console.log(customerName);
        setSelectedSearchInvoice(customerName);
        setSearchQuery(customerName);
        const filtered = invoices.msg.filter(invoice =>
            invoice.customerName.toLowerCase() === customerName.toLowerCase()
        );
        setFilteredInvoices(filtered);
        setsearchDropdownVisible(false);
    };

    //searchbox customername selection for invoice end

    //calling invoice template on download click start

    // const handleDownloadPDF = async (event) => {
    //     try {

    //         console.log(selectedInvoices);

    //         if (selectedInvoices.length === 0 || selectedInvoices.length > 1) {
    //             alert('Please select single invoice to download')
    //         }
    //         else {
    //             console.log(selectedInvoices);
    //             const response = await axios.post('http://localhost:7116/api/controller/GetInvoiceItemDetails', selectedInvoices,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${user.token}`,
    //                         'Content-Type': 'application/json'
    //                     },
    //                     responseType: 'blob',
    //                 }
    //             );

    //             if (response.status === 200) {
    //                 axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

    //                 const blob = new Blob([response.data], { type: 'application/pdf' });
    //                 const url = window.URL.createObjectURL(blob);

    //                 const link = document.createElement('a');
    //                 link.href = url;
    //                 link.download = 'Invoice.pdf';
    //                 document.body.appendChild(link);
    //                 link.click();

    //                 document.body.removeChild(link);
    //                 window.URL.revokeObjectURL(url);


    //                 //alert('Invoice Created');
    //                 console.log('Invoice downloaded');
    //             } else {
    //                 console.log('Invoice download failed');
    //                 // setShowAlert(true);
    //             }
    //         }

    //     } catch (error) {
    //         console.error('Error:', error);
    //         // setShowAlert(true);
    //     } finally {
    //         // setLoading(false);
    //     }
    // };

    const fetchData = async (event) => {
        try {

            console.log("FetchData - InvoiceNO selected", selectedInvoices);

            if (selectedInvoices.length === 0 || selectedInvoices.length > 1) {
                alert('Please select single invoice to download')
                return false;
            }
            else {
                console.log(selectedInvoices);
                const response = await axios.post('http://localhost:7116/api/controller/GetInvoiceItemDetails', selectedInvoices,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 200) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
                    console.log("apiResponse", response.data.msg);

                    setInvoiceData(response.data.msg);

                    //alert('Invoice Created');
                    console.log('Invoice downloaded');
                    return true;
                } else {
                    console.log('Invoice download failed');
                    // setShowAlert(true);
                }
            }

        } catch (error) {
            console.error('Error:', error);
            // setShowAlert(true);
        } finally {
            // setLoading(false);
        }
    };

    const download = async () => {
        var result = await fetchData();
        console.log("fetchData result", result);
        if (result == true) {
            if (invoiceData) {
                const element = templateRef.current;
                const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                const data = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProperties = pdf.getImageProperties(data);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

                if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdf.internal.pageSize.getHeight());
                } else {
                    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
                }
                pdf.save('Invoice.pdf');
            }
        }
    };
    //calling invoice template on download click end
    //loguot//
    const handleLogout = () => {

        localStorage.removeItem('user');


    };
    const uniqueCustomerNames = filteredInvoices.length > 0 ? [...new Set(filteredInvoices.map(invoice => invoice.customerName))] : [];

    return (
        <div>
            {/* Dashboard */}
            <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
                {/* Vertical Navbar */}
                <nav className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg" id="navbarVertical">
                    <div className="container-fluid">
                        {/* Toggler */}
                        <button className="navbar-toggler ms-n2" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        {/* Brand */}
                        <a className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0" href="#">
                            <img src={logo} alt="" style={{ width: '180px', height: '50px' }} />
                        </a>

                        <div className="collapse navbar-collapse" id="sidebarCollapse">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleViewChange('dashboard')}>
                                        <i className="bi bi-house h4"></i> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleViewChange('invoice')}>
                                        <i className="bi bi-bar-chart h4"></i> Invoices
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleViewChange('customer')}>
                                        <i className="bi bi-person-plus h4"></i> Customer
                                    </a>
                                </li>
                            </ul>
                            {/* <hr className="navbar-divider my-5 opacity-20" /> */}
                            <div className="mt-auto"></div>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href='/' onClick={handleLogout} >
                                        <i className="bi bi-box-arrow-left h4"></i> Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {/* Main content and Invoice creation */}
                <div className="h-screen flex-grow-1 overflow-y-lg-auto">
                    <header class="bg-surface-primary border-bottom pt-6">
                        <div class="container-fluid bg-white">
                            <div class="mb-npx">
                                <div class="row align-items-center">
                                    <div class="col-sm-6 col-12 mb-4 mb-sm-0">
                                        {/* <!-- Title --> */}
                                        <h1 class="h2 mb-0 ls-tight">Invoice Management</h1>
                                    </div>
                                </div>
                                {/* <!-- Nav --> */}
                                <ul class="nav nav-tabs mt-4 overflow-x border-0">

                                </ul>
                            </div>
                        </div>
                    </header>
                    {view === 'dashboard' && (
                        <main className="py-6 bg-surface-secondary">
                            <div className="container-fluid">
                                <div className="card shadow border-0 mb-7">
                                    <div className="card-header d-flex justify-content-between align-items-center ">
                                        <h5 className="mb-0">View Invoices</h5>
                                        <div className="d-flex gap-1 h-12">
                                            <input type="text" className="form-control form-control-sm" placeholder="Search..."
                                                value={searchQuery}
                                                onChange={handleSearchChange} />
                                            {/* <div className="input-group-append">
                                                <button className="btn btn-primary btn-sm">
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div> */}
                                            {searchdropdownVisible && uniqueCustomerNames.length > 0 && (
                                                <div className="dropdown-menu show position-absolute" style={{ top: '27%', zIndex: 1000 }}>
                                                    {uniqueCustomerNames.map((customerName, index) => (
                                                        <a
                                                            key={index}
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={() => handleInvoiceSelect(customerName)}
                                                        >
                                                            {customerName}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover table-nowrap">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th>
                                                        {/* <input type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll} /> */}
                                                    </th>
                                                    <th scope="col">Invoice Date</th>
                                                    <th scope="col">Customer Name</th>
                                                    <th scope="col">Invoice No</th>
                                                    <th scope="col">Amount</th>
                                                    <th class="text-center">
                                                        {invoiceData && invoiceData.length > 0 && (
                                                            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '210mm' }}>
                                                                <Template ref={templateRef} invoiceData={invoiceData} />
                                                            </div>
                                                        )}
                                                        <button class="btn btn-sm btn-primary" onClick={download}>
                                                            <i class="bi bi-download"></i>
                                                        </button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {invoices && invoices.success && invoices.msg.map((invoice, index) => {
                                                const invoiceDate = new Date(invoice.invoiceDate);
                                                const formattedDate = invoiceDate.toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                });

                                                return (
                                                    <tr key={index}>
                                                        <td>{formattedDate}</td>
                                                        <td>{invoice.customerName}</td>
                                                        <td>{invoice.invoiceNo}</td>
                                                        <td>${invoice.amount.toFixed(2)}</td>
                                                        <td class="text-end"><a href="#" class="btn btn-sm btn-neutral w-20 bg-white h-10">View</a>
                                                    <button type="button" class="btn btn-sm btn-square btn-neutral bg-white  text-danger-hover">
                                                        <i class="bi bi-trash"></i>
                                                    </button></td>
                                                    </tr>
                                                );
                                            })} */}
                                                {renderInvoices()}

                                            </tbody>
                                        </table>
                                    </div>
                                    {/* <div className="card-footer border-0 py-4">
                                        <span className="text-muted text-sm">
                                            Showing {invoices.msg ? invoices.msg.length : 0} items out of {invoices.msg ? invoices.msg.length : 0} results found
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </main>
                    )}

                    {view === 'invoice' && (
                        <form onSubmit={sbt_invoicedata}>
                            <main class="py-6 bg-surface-secondary">
                                <div class="container-fluid">
                                    <div class="card shadow border-0 mb-7">
                                        <div class="card-header bg-white">
                                            <h5 class="mb-3 mt-2">Invoice Creation</h5>
                                        </div>
                                        <br></br>
                                        <div className="d-flex align-items-center gap-5">
                                            <div className=" btn-group w-25 h-10" style={{ marginLeft: "21px" }}>
                                                <button
                                                    className="btn btn-sm dropdown-toggle text-dark border-1  shadow-none"
                                                    type="button"
                                                    id="defaultDropdown"
                                                    data-bs-toggle="dropdown"
                                                    data-bs-auto-close="true"
                                                    aria-expanded="false"
                                                    value={setSelectedddValue}
                                                    onChange={(e) => handledropdowmChange()}
                                                    style={{ backgroundColor: "#f5f9fc" }}
                                                >
                                                    {selectedddValue}
                                                </button>
                                                <ul className="dropdown-menu scrollable-menu " role='menu' aria-labelledby="defaultDropdown" style={{ width: "100%" }}>
                                                    {rendercustomerName()}
                                                </ul>
                                            </div>
                                            {/* <div class="btn-group">
                                            <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                Dropdown Button
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#">Action</a></li>
                                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                                <li><hr class="dropdown-divider"/></li>
                                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                                            </ul>
                                        </div> */}

                                            <button
                                                className="btn  h-10  w-24 btn-sm text-dark d-flex align-items-center border-1 shadow-none"
                                                style={{ backgroundColor: "#f5f9fc" }}
                                                onClick={addNewRow}
                                            >
                                                <i className="bi bi-plus"></i>
                                                <span className="ms-1">Add Row</span>
                                            </button>

                                        </div>

                                        <br></br>
                                        <div class="table-responsive">
                                            <table class="table table-hover table-nowrap">
                                                <thead class="thead-light">
                                                    <tr>
                                                        <th scope="col">Item Name</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Amount</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((row) => (
                                                        <tr key={row.id}>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    required
                                                                    value={row.itemName}
                                                                    onChange={(e) => handleInputChange(row.id, 'itemName', e.target.value)}

                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    required
                                                                    value={row.unit}
                                                                    onChange={(e) => handleInputChange(row.id, 'unit', e.target.value)}

                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    required
                                                                    value={row.price}
                                                                    onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}

                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    required
                                                                    value={row.amount}
                                                                    onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)}
                                                                    readOnly="true"
                                                                />
                                                            </td>
                                                            <td className="text-end">
                                                            </td>
                                                            <td className="text-end">
                                                                <button className="btn btn-sm btn-square btn-danger " onClick={() => deleteRow(row.id)}>
                                                                    <i class="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                        <div class="card-footer border-0 mb-3 bg-white">
                                            {/* <div>
                                                <button className="btn btn-primary btn-sm bg-light text-dark d-flex align-items-center border-1 border-black me-2 shadow-none">
                                                    <span className="ms-1">Submit</span>
                                                </button>
                                            </div> */}
                                            {/* <div>
                                                <label>Sub Total</label>
                                                <div class="form-floating mb-0" >
                                                    <input type="text" id="txtgst" class="form-control form-control-sm" required />
                                                    <label class="form-label" for="form4Example2">GST</label>
                                                </div>
                                            </div> */}
                                            <div class="w-50 card shadow" >
                                                <div class="d-flex justify-content-between  mb-3 px-5 py-3" style={{ backgroundColor: "#f5f9fc" }} >
                                                    <div class="col-3">
                                                        Sub Total
                                                        <br />
                                                    </div>
                                                    <div class="col-3">
                                                        <input class="form-control form-control-sm text-end" readOnly="true"
                                                            value={subtotal}

                                                        ></input>
                                                    </div>
                                                </div>
                                                {/* <hr class="my-n2 bg-light" /> */}
                                                <div class=" row d-flex justify-content-between mb-3  px-5 py-1">
                                                    <div class="col-3">
                                                        SGST (%)
                                                        <br />
                                                    </div>
                                                    <div class="col-3">
                                                        <input class="form-control form-control-sm text-end" value={sgstRate}
                                                            onChange={(e) => netTotalAmount(e.target.value, cgstRate)} required
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div class=" row d-flex justify-content-between mb-3  px-5 py-1">
                                                    <div class="col-3">
                                                        CGST (%)
                                                        <br />
                                                    </div>
                                                    <div class="col-3">
                                                        <input class="form-control form-control-sm text-end" value={cgstRate}
                                                            onChange={(e) => netTotalAmount(sgstRate, e.target.value)} required
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-between mb-3 px-5 py-3 " style={{ backgroundColor: "#f5f9fc" }}>
                                                    <div class="">
                                                        Total Amount (₹)
                                                        <br />
                                                    </div>
                                                    <div class="">
                                                        <input class="form-control form-control-sm text-end" readOnly="true"
                                                            value={NetTotalAmt}
                                                        //onChange={(e) => netTotalAmount(e.target.value)}
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-between px-5 py-3">
                                                    <div class="">
                                                        <button className="btn btn-secondary btn-sm text-dark d-flex align-items-center border-1 border-white me-2 shadow-none"
                                                        >
                                                            <span className="ms-1">Submit</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </form>
                    )}
                    {view === 'customer' && (
                        <main class="py-6 bg-surface-secondary">
                            <div class="container-fluid">
                                <div class="card shadow border-0 mb-7">
                                    <div class="card-header bg-white">
                                        <h5 class="mb-3 mt-2">Customer Creation</h5>
                                    </div>
                                    <div class="container" style={{ marginLeft: "-20px" }}>
                                        <form class="p-md-5" onSubmit={sbt_customerdata} style={{ marginLeft: "20px" }}>
                                            <div class="btn-group gap-3">
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtfname" class="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                                                    />
                                                    <span style={{ color: '#b8635f' }}>{firstNameErrorSpan}</span>
                                                    <label class="form-label" for="form4Example1">First Name</label>
                                                </div>
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtlname" class="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                                    <label class="form-label" for="form4Example2">Last Name</label>
                                                </div>
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtphone" class="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required pattern='[1-9]{1}[0-9]{9}' title='Phone no should ne numeric' maxLength={10} />
                                                    <label class="form-label" for="form4Example2">Phone No.</label>
                                                </div>
                                            </div>
                                            <div class="form-floating mb-3" style={{ width: "130%" }}>
                                                <input type="address" id="txtaddress" class="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                                <label class="form-label" for="form4Example2">Address</label>
                                            </div>
                                            <div class="btn-group gap-3">
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtstate" class="form-control" value={state} onChange={(e) => setState(e.target.value)} required />
                                                    <label class="form-label" for="form4Example2">State</label>
                                                </div>
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtcity" class="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />

                                                    <label class="form-label" for="form4Example2">City</label>
                                                </div>
                                            </div>
                                            <br></br>
                                            <div class="btn-group gap-3">
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtemail" class="form-control" value={email}
                                                        onChange={(e) => setEmailId(e.target.value)}

                                                    />
                                                    <span style={{ color: '#b8635f' }}>{emailErrorSpan}</span>
                                                    <label class="form-label" for="form4Example2">Email Address</label>
                                                </div>
                                                <div class="form-floating mb-3">
                                                    <input type="text" id="txtpincode" class="form-control" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                                                    <label class="form-label" for="form4Example2">PinCode</label>
                                                </div>
                                            </div>
                                            <div class="card-footer border-0 mb-3 bg-white" style={{ marginLeft: "-20px" }}>
                                                <button className="btn btn-secondary btn-sm d-flex align-items-center me-2  shadow-none text-dark">
                                                    <span className="ms-1">Submit</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </main>
                    )}
                    {/* Main content and Invoice creation end */}
                </div>
            </div>
        </div>
    );
}

export default DashBoard;

