import { useEffect } from "react";
import "../invoice.css"
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import invoice_Logo from '../images/invoice-logo.png';


// dimension

import { useGetOrderDetailsQuery  } from "../slices/orderApiSlice";


const InvoicePage = () => {
  const params = useParams();
  const { data, isLoading, error } = useGetOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const { shippingInfo, orderItems, paymentInfo, user } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const handleDownload = () => {
    const input = document.getElementById("order_invoice");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();

      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, 0);
      pdf.save(`invoice_${order?._id}.pdf`);
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <Meta title={"Order Invoice"} />
      <div className="order-invoice my-5">
        <div className="row d-flex justify-content-center mb-5">
          <button className="btn btn-success col-md-5" onClick={handleDownload}>
            <i className="fa fa-print"></i> Téléchargé Réçu
          </button>
        </div>
        <div id="order_invoice" className="p-3 border border-secondary">
          <header className="clearfix">
            <div id="logo">
              <img src={ invoice_Logo } alt="Company Logo" />
            </div>
            <h1>Réçu # {order?._id}</h1>
            <div id="company" className="clearfix">
              <div>ShopIT</div>
              <div>
                9 Avenue Général Leclerc,
                <br />
                92000 - Paris
              </div>
              <div>(33) 519-0450</div>
              <div>
                <a href="mailto:info@shopit.com">info@shopit.com</a>
              </div>
            </div>
            <div id="project">
              <div>
                <span>NOM</span> {user?.name}
              </div>
              <div>
                <span>EMAIL</span> {user?.email}
              </div>
              <div>
                <span>TEL </span> { shippingInfo?.phoneNo }
              </div>
              <div>
                <span>ADRESSE</span>
                {shippingInfo?.address}, {shippingInfo?.city},{" "}
                {shippingInfo?.zipCode}, {shippingInfo?.country}
              </div>
              <div>
                <span>DATE</span>{" "}
                {new Date(order?.createdAt).toLocaleString("en-FR")}
              </div>
              <div>
                <span>Status</span> {paymentInfo?.status}
              </div>
            </div>
          </header>
          <main>
            <table className="mt-5">
              <thead>
                <tr>
                  <th className="service">ID</th>
                  <th className="desc">NOM</th>
                  <th>PRIX</th>
                  <th>QTE</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item) => (
                  <tr>
                    <td className="service">{item?.product}</td>
                    <td className="desc">{item?.name}</td>
                    <td className="unit">${item?.price}</td>
                    <td className="qty">{item?.quantity}</td>
                    <td className="total">${item?.price * item?.quantity}</td>
                  </tr>
                ))}

                <tr>
                  <td colspan="4">
                    <b>SOUS TOTAL</b>
                  </td>
                  <td className="total">${order?.itemsPrice}</td>
                </tr>

                <tr>
                  <td colspan="4">
                    <b>TVA 15%</b>
                  </td>
                  <td className="total">${order?.taxAmount}</td>
                </tr>

                <tr>
                  <td colspan="4">
                    <b>LIVRAISON</b>
                  </td>
                  <td className="total">${order?.shippingAmount}</td>
                </tr>

                <tr>
                  <td colspan="4" className="grand total">
                    <b>TOTAL</b>
                  </td>
                  <td className="grand total">${order?.totalAmount}</td>
                </tr>
              </tbody>
            </table>
            <div id="notices">
              <div>REMARQUE:</div>
              <div className="notice">
                A finance charge of 1.5% will be made on unpaid balances after
                30 days.
              </div>
            </div>
          </main>
          <footer>
            Invoice was created on a computer and is valid without the
            signature.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;