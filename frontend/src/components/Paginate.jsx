import { useEffect, useState } from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import Pagination from 'react-js-pagination';

const Paginate = ({resPerPage, filteredProductsCount}) => {

    const [currentPage, setCurrentPage] = useState();

    const navigate = useNavigate();

    let [searchParams] = useSearchParams();
   
    
    const page = Number(searchParams.get('page')) || 1;


    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);

        if(searchParams.has("page")){
            searchParams.set("page", pageNumber);
        }else{
            searchParams.append("page", pageNumber);
        }

        const path = window.location.pathname + "?" + searchParams.toString();

        navigate(path);
    }

    return (
        <div className='d-flex justify-content-center my-5'>
            {filteredProductsCount > resPerPage && 
            <Pagination
            activePage={currentPage}
            itemsCountPerPage={resPerPage}
            totalItemsCount={filteredProductsCount}
            onChange={setCurrentPageNo}
            nextPageText={"Suivant"}
            prevPageText={"Précédent"}
            // firstPageText={"First"}
            // lastPageText={"Last"}
            itemClass='page-item'
            linkClass='page-link'
            />}
        </div> 
    );
};

export default Paginate;