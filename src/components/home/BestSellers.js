import React, {useEffect, useState} from 'react';
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCard from '../cards/ProductCard';
import LoadingCard from '../cards/LoadingCard';
import {Pagination} from "antd";

const BestSellers = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0)
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAllProducts()
    }, [page])

    useEffect(() => {
        getProductsCount().then((res) => setProductsCount(res.data))
    }, [])

    //sort, order, limit
    const loadAllProducts = () => {
        setLoading(true)
        getProducts('sold', 'desc', page).then((res) => {
            setProducts(res.data);
            setLoading(false)
        })
    }

    return (
        <>
        <div className="container">
            {loading ? <LoadingCard count={6} /> :
                <div className="row">
                    {products.map((product) =>
                        <div className="col-md-4 mb-4" key={product._id}>
                            <ProductCard                             
                                product={product}
                            /> 
                        </div>
                    )}
                </div>
            }
        </div>    
        
        <div className="row">
                <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
                    <Pagination 
                        current={page} 
                        total={(productsCount / 3) * 5} 
                        onChange={(value) => setPage(value)}
                    />
                </nav>
            </div>
        </>
    )
}

export default BestSellers;
