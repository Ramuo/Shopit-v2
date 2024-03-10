import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { countries } from "countries-list";
import Meta from '../components/Meta';
import CheckoutSteps from '../components/CheckoutSteps';


import {saveShippingInfo} from '../slices/cartSlice'

const ShippingPage = () => {
    const countriesList = Object.values(countries);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [country, setCountry] = useState("");
  
    const { shippingInfo } = useSelector((state) => state.cart);
  
    useEffect(() => {
      if (shippingInfo) {
        setAddress(shippingInfo?.address);
        setCity(shippingInfo?.city);
        setZipCode(shippingInfo?.zipCode);
        setPhoneNo(shippingInfo?.phoneNo);
        setCountry(shippingInfo?.country);
      }
    }, [shippingInfo]);
  
    const submiHandler = (e) => {
      e.preventDefault();
  
      dispatch(saveShippingInfo({ address, city, phoneNo, zipCode, country }));
      navigate("/confirm_order");
    };
  
    return (
      <>
        <Meta title={"Livraison"} />
  
        <CheckoutSteps shipping />
  
        <div className="row wrapper mb-5">
          <div className="col-10 col-lg-5">
            <form className="shadow rounded bg-body" onSubmit={submiHandler}>
              <h2 className="mb-4">Livraison</h2>
              <div className="mb-3">
                <label htmlFor="address_field" className="form-label">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address_field"
                  className="form-control"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="city_field" className="form-label">
                  Ville
                </label>
                <input
                  type="text"
                  id="city_field"
                  className="form-control"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="phone_field" className="form-label">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone_field"
                  className="form-control"
                  name="phoneNo"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  required
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="zip_code_field" className="form-label">
                  Code Postal
                </label>
                <input
                  type="number"
                  id="zip_code_field"
                  className="form-control"
                  name="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="country_field" className="form-label">
                  Pays
                </label>
                <select
                  id="country_field"
                  className="form-select"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  {countriesList?.map((country) => (
                    <option key={country?.name} value={country?.name}>
                      {country?.name}
                    </option>
                  ))}
                </select>
              </div>
  
              <button id="shipping_btn" type="submit" className="btn w-100 py-2">
                CONTINUER
              </button>
            </form>
          </div>
        </div>
      </>
    );
  };

export default ShippingPage