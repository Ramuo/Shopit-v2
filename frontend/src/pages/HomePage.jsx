import React from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import Meta from '../components/Meta';
import {Alert} from 'flowbite-react';
import ProductItem from '../components/ProductItem';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Filters from '../components/Filters';



import {useGetProductsQuery} from '../slices/prductApiSlice';

const HomePage = () => {

  let [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const keyword = searchParams.get('keyword') || "";
  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const category = searchParams.get('category');
  const ratings = searchParams.get('ratings');

  const params = {page, keyword};

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const {data, isLoading, error} = useGetProductsQuery(params);

  const columnSize = keyword ? 4 : 3;

  return (
    <>
      <Meta title={'Le Bon Prix'}/>
      { isLoading ? (
          <Loader/>
        ) : error ? (
          <Alert color='failure' className='mt-5'>
            { error?.data?.message}
          </Alert>
        ) : (
          <div className="row">
            {keyword && (
              <div className="col-6 col-md-3 mt-5">
                <Filters/>
              </div>
            )}
            <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
              <h1 id="products_heading" className="text-secondary">
                {keyword 
                  ? `${data?.products?.length} Articles trouvés avec : ${keyword}` 
                  : "Derniers arrivages"
                }
                 
              </h1>
              <section id="products" className="mt-5">
                <div className="row">
                  {data?.products?.map((product) => (
                    <ProductItem product={product} key={product?._id} columnSize={columnSize}/>
                  ))}
                </div>
              </section>

              <Paginate
              resPerPage={data?.resPerPage}
              filteredProductsCount={data?.filteredProductsCount}
              />
            </div>
          </div>
        )}
    </>
  )
}

export default HomePage;