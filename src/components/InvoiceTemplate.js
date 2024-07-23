
import React from 'react';
import logo from '../components/images/logo-png.png';
//import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Template = React.forwardRef(({ invoiceData }, ref) => {

    const calculateGSTAmount = (subtotal, gstRate) => {
    console.log("SUBTOTAL:",subtotal);
    console.log("GSTRATE:",gstRate);

        return (subtotal * gstRate) / 100;
    };

    const itemDetails = invoiceData[0].companyDetails.customerdetails[0].itemDetails;
    console.log("ITEMDETAILS: ",itemDetails);

    const subtotal = itemDetails[0].subtotalAmt;
    const sgstRate = itemDetails[0].sgstRate;
    const cgstRate = itemDetails[0].cgstRate;
    const sgstAmount = calculateGSTAmount(subtotal, sgstRate);
    console.log("SGST:",sgstRate);
    const cgstAmount = calculateGSTAmount(subtotal, cgstRate);
    console.log("CGST:",cgstRate);

    return (
        <div ref={ref} class="container">
            <div class="col-md-12">
                <div class="bg-white px-15">
                    <div class="" style={{paddingTop:35}}>
                        <div class=" text-inverse f-w-300" style={{color:'black'}}>
                            {invoiceData[0].companyDetails.companyName}
                        </div>
                        <div className='' style={{ fontSize: 8 }} >
                            {invoiceData[0].companyDetails.companyaddress}<br></br>
                            {invoiceData[0].companyDetails.companycity}, {invoiceData[0].companyDetails.companystate}<br></br>
                            Phone No: {invoiceData[0].companyDetails.companyphoneNo}
                        </div>
                    </div>
                    <div class="d-flex justify-content-between mt-5 bg-light px-20" style={{ width: 548, margin: 0 - 20 ,color:'black'}}>
                        <div class="">
                            <small>TO</small>
                            <address class="m-t-5 m-b-5 ">
                                {invoiceData[0].companyDetails.customerdetails[0].customername}<br />
                                {invoiceData[0].companyDetails.customerdetails[0].custoomeraddress}
                                <br />
                                {invoiceData[0].companyDetails.customerdetails[0].customercity}, {invoiceData[0].companyDetails.customerdetails[0].customerstate}
                            </address>
                        </div>
                        <div class="">
                            <small>Invoice No : {invoiceData[0].companyDetails.customerdetails[0].itemDetails[0].invoiceNo} </small>
                            <br></br>
                            <small>Date : {invoiceData[0].companyDetails.customerdetails[0].itemDetails[0].invocieDate}</small>

                        </div>
                    </div>

                    <div class="" style={{ width: 548, marginTop: 40, marginLeft: -20 }}>
                        <div class="table-responsive">
                            <table class="table">
                                <thead style={{ textAlign: 'left', justifyContent: 'space-between' }}>
                                    <tr>
                                        <th class='text-center' style={{color:'black'}}>Description</th>
                                        <th class="text-center" style={{color:'black'}} width="10%">Quantity</th>
                                        <th class="text-center" style={{color:'black'}} width="10%">Rate</th>
                                        <th class="text-right" style={{color:'black'}} width="20%">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceData[0].companyDetails.customerdetails[0].itemDetails.map((item, index) => (
                                        <tr key={index} style={{justifyContent:'space-around'}}>
                                            <td class="text-left">
                                                <p style={{ fontSize: 9, wordWrap:'break-word', whiteSpace: 'normal',color:'black' }}>{item.itemName}  </p>
                                            </td>
                                            <td class="text-center">
                                                <p style={{ fontSize: 9, wordWrap: 'break-word', whiteSpace: 'normal',color:'black' }}>{item.quantity}</p>
                                            </td>
                                            <td class="text-right">
                                                <p style={{ fontSize: 9, wordWrap: 'break-word', whiteSpace: 'normal',color:'black', width:100 }}> {'₹ '+ item.price}</p>
                                            </td>
                                            <td class="text-right">
                                                <p style={{ fontSize: 9, wordWrap: 'break-word', whiteSpace: 'normal',color:'black' }}> {'₹ '+item.amount}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class="bg-light" style={{color:'black'}}><br></br>
                            <div class="d-flex" style={{ display: 'table-cell', padding: -7, justifyContent: 'space-evenly' }}>
                                <div style={{marginLeft: 310}}>
                                    <small>SUB TOTAL</small>
                                </div>
                                <div style={{paddingLeft:23}}>
                                    <span>₹ {invoiceData[0].companyDetails.customerdetails[0].itemDetails[0].subtotalAmt.toFixed(2)}</span>
                                </div>
                            </div>
                            <div class="d-flex" style={{ display: 'table-cell', padding: -5, justifyContent: 'space-evenly' }}>
                                <div style={{marginLeft:310}}>
                                    <small>SGST {sgstRate}%</small>
                                </div>
                                <div style={{paddingLeft:23}}>
                                    <span>₹ {sgstAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div class="d-flex" style={{ display: 'table-cell', padding: -5, justifyContent: 'space-evenly' }}>
                                <div style={{marginLeft:310}}>
                                    <small>CGST {cgstRate}%</small>
                                </div>
                                <div style={{paddingLeft:23}}>
                                    <span>₹ {cgstAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <br></br>
                            <div style={{background: '#2d353c',width: 197,height:50,marginLeft:350}}>
                                <p style={{textAlign:'left',paddingLeft:3,paddingTop:3}}>TOTAL</p> 
                                <p style={{fontSize:17,fontWeight:'normal',marginLeft:15,color:'white'}}>₹ {invoiceData[0].companyDetails.customerdetails[0].itemDetails[0].netAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* <div class="invoice-note">
            * Make all cheques payable to [Your Company Name]<br/>
            * Payment is due within 30 days<br/>
            * If you have any questions concerning this invoice, contact  [Name, Phone Number, Email]
         </div> */}
        
         <div style={{marginTop : 20}}>
            <p class="text-center  f-w-600">
               
            </p>
            <p class="d-flex justify-content-center gap-5">
               <p><i class="fa fa-fw fa-sm fa-envelope"></i>{invoiceData[0].companyDetails.companyemail}</p>
               <p><i class="fa fa-fw fa-sm fa-phone-volume"></i>{invoiceData[0].companyDetails.companyphoneNo
               }</p>
            </p>
         </div>
                </div>
            </div>
        </div>
    );
});

export default Template;