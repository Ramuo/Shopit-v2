import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {PRODUCT_CATEGORIES} from './helpers/categoryConstants';
import {getPriceQueryParams} from './helpers/FilterHelper';
import StarRatings from 'react-star-ratings';

const Filters = () => {
    const navigate = useNavigate();

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    
    let [searchParams] = useSearchParams();


    useEffect(() => {
        searchParams.has("min") && setMin(searchParams.get("min"));
        searchParams.has("max") && setMin(searchParams.get("max"));
    }, [searchParams]);


    //Handle Category and Ratings filters
    const handleClick = (checkbox) => {
        const checkboxes = document.getElementsByName(checkbox.name);
        
        checkboxes.forEach((item) => {
            if(item !== checkbox)  item.checked = false;
        });

        if(checkbox.checked === false){
            //Delete filter from query
            if(searchParams.has(checkbox.name)){
                searchParams.delete(checkbox.name)
                const path = window.location.pathname + "?" + searchParams.toString();
                navigate(path);
            };
        }else{
            //Set a new filter value
            if(searchParams.has(checkbox.name)){
                searchParams.set(checkbox.name, checkbox.value);
            }else{
                //append new filter
                searchParams.append(checkbox.name, checkbox.value);
            };

            const path = window.location.pathname + "?" + searchParams.toString();
            navigate(path);
        }
    };

    const defaultCheckHandler = (checkboxType, checkboxValue) => {
        const value = searchParams.get(checkboxType);

        if(checkboxValue === value) return true;
        
        return false;
    }

    //Handle Price Filter
    const handleButtonClick = (e) => {
        e.preventDefault();

        searchParams = getPriceQueryParams(searchParams, "min", min);
        searchParams = getPriceQueryParams(searchParams, "max", max);


        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);

    };

    return (
    <div className="border p-3 filter">
        <h3>Filtres</h3>
        <hr />
        <h5 className="filter-heading mb-3">Prix</h5>
        <form
        id="filter_form"
        className="px-2"
        onSubmit={handleButtonClick}
        >
            <div className="row">
                <div className="col">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Min/€"
                    name="min"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                />
                </div>
                <div className="col">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Max/€"
                    name="max"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                />
                </div>
                <div className="col">
                <button type="submit" className="btn btn-primary">GO</button>
                </div>
            </div>
        </form>
        <hr />
        <h5 className="mb-3">Category</h5>

        {PRODUCT_CATEGORIES?.map((category) => (
            <div className="form-check" key={category?._id}>
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="category"
                    id="check4"
                    value={category}
                    onClick={(e) => handleClick(e.target)}
                    defaultChecked={defaultCheckHandler("category", category)}    
                />
                <label className="form-check-label" for="check4"> 
                    {" "}
                    {category}
                </label>
            </div>
        ))}
        <hr />
        <h5 className="mb-3">Avis</h5>
        {[5, 4, 3, 2, 1]?.map((rating) => (
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="ratings"
                    id="check7"
                    value={rating}
                    onClick={(e) => handleClick(e.target)}
                    defaultChecked={defaultCheckHandler("ratings", rating?.toString())}  
                />
                <label className="form-check-label" for="check7">
                    <StarRatings
                    rating={rating}
                    starRatedColor='#ffb829'
                    numberOfStars={5}
                    name='rating'z
                    starDimension='21px'
                    starSpacing='1px'
                    />
                </label>
            </div>  
        ))}
    </div>
    )
}

export default Filters;