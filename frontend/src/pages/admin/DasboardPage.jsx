import {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import AdminLayout from '../../components/AdminLayout';
import SalesChart from '../../components/SalesChart';
import {toast} from 'react-toastify';
import Loader from '../../components/Loader'

import {useLazyGetSalesQuery} from '../../slices/orderApiSlice'

const DasboardPage = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());

  const [getSales, {isLoading, error, data}] = useLazyGetSalesQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    };

    if(startDate && endDate && !data){
      getSales({
        startDate: new Date(startDate).toISOString(),
        endDate: endDate.toISOString()
      })
    }
  }, [error, startDate, endDate, data, getSales]);

  const submitHandler = () => {
    getSales({
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString()
    })
  }

  console.log(data)

  if(isLoading) return <Loader/>
  
  return (
    <AdminLayout>
      <div className="d-flex justify-content-start align-items-center">
        <div className="mb-3 me-4">
          <label className="form-label d-block">Date de début</label>
          <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className='form-control'
          />
        </div>
        <div className="mb-3">
          <label className="form-label d-block">Date de Fin</label>
          <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className='form-control'
        />
        </div>
        <button 
        className="btn fetch-btn ms-4 mt-3 px-5"
        onClick={submitHandler}
        >
          Chercher
        </button>
      </div>

      <div className="row pr-4 my-5">
        <div className="col-xl-6 col-sm-12 mb-3">
          <div className="card text-white bg-success o-hidden h-100">
            <div className="card-body">
              <div className="text-center card-font-size">
                Ventes
                <br />
                <b>{data?.totalSales?.toFixed(2)}€</b>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-sm-12 mb-3">
          <div className="card text-white bg-danger o-hidden h-100">
            <div className="card-body">
              <div className="text-center card-font-size">
                Commandes
                <br />
                <b>{data?.totalNumOrders}</b>
              </div>
            </div>
          </div>
        </div>
      </div>


      <SalesChart salesData={data?.sales}/>

      <div className="mb-5"></div>
    </AdminLayout>
  )
}

export default DasboardPage;