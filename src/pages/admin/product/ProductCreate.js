import React, { useState, useEffect } from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
    createProduct
} from "../../../functions/product";
import {
    getCategories,
    getCategorySubs
} from "../../../functions/category";
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import FileUpload from '../../../components/forms/FileUpload';
import {LoadingOutlined} from '@ant-design/icons';

const initialState = {
    title: "McBook Pro",
    description: "This is the best apple product",
    price: "450000",
    categories: [],
    category: "",
    subs: [],
    shipping: "Yes",
    quantity: "50",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "MSI", "Lenovo", "ASUS", "Toshiba", "Huawei", "HP", "Razer", "Acer", "Dell"],
    color: "White",
    brand: "Apple"

}


const ProductCreate = () => {

    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([]);
    const [showSub, setShowSub] = useState(false);
    const [loading, setLoading] = useState(false);

    //redux state
    const {user} = useSelector((state) => ({...state}))

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((c) => setValues({...values, categories: c.data}));

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
        .then((res) => {
            //console.log(res)
            window.alert(`"${res.data.title}" is created`)
            window.location.reload();
        })
        .catch((err) => {
            //console.log(err)
            //if(err.response.status === 400) toast.error(err.response.data)
            toast.error(err.response.data.err)
        })
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name] : e.target.value})
        //console.log(e.target.name, "...........", e.target.value)
    }

    const handleCategoryChange = (e) => {
        e.preventDefault()
        //console.log('CLICKED CATEGORY', e.target.value)
        setValues({...values, subs: [], category : e.target.value});
        getCategorySubs(e.target.value)
        .then((res) => {
            console.log("SUB OPTION on category click", res)
            setSubOptions(res.data)
        })
        setShowSub(true) //To show sub category only when parent category is clicked
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Product Create</h4>
                    )}
                    <hr />
                    {/*JSON.stringify(values.categories)*/}
                    {/*JSON.stringify(values)*/}
                    {/*JSON.stringify(values.subs)*/}
                    {/*JSON.stringify(values.images)*/}


                    <div className="p-3">
                        <FileUpload  
                            values={values} 
                            setValues={setValues} 
                            setLoading={setLoading}
                        />
                    </div>

                    <ProductCreateForm 
                        handleSubmit={handleSubmit} 
                        handleChange={handleChange}
                        values={values}
                        setValues={setValues}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        showSub={showSub}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductCreate;
