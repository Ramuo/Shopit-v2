import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaSearch} from 'react-icons/fa';

const SearchBox = () => {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");


    const submithandler = async (e) => {
        e.preventDefault();

        if(keyword?.trim()){
            navigate(`/?keyword=${keyword}`)
        }else{
            navigate('/')
        }
    } 

    return (
    <form onSubmit={submithandler}>
        <div className="input-group">
            <input
            type="text"
            id="search_field"
            aria-describedby="search_btn"
            className="form-control"
            placeholder="Rechercher..."
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            />
            <button id="search_btn" className="btn" type="submit">
                <FaSearch className="fa fa-search" aria-hidden="true"/>
            </button>
        </div>
    </form>
    )
}

export default SearchBox;