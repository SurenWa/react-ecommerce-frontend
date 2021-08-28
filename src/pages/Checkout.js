import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getUserCart,
    emptyUserCart,
    saveUserAddress,
    applyCoupon,
    createCashOrderForUser,
    
} from '../functions/user';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";


const CheckOut = ({ history }) => {
    const dispatch = useDispatch();
    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponTrueOrFalse = useSelector((state) => state.coupon)

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('')
    const [totalAfterDiscount, setTotalAfterDisocunt] = useState(0)
    const [discountError, setDiscountError] = useState('')

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            //console.log("User Cart Res", JSON.stringify(res.data, null, 4))
            setProducts(res.data.products)
            setTotal(res.data.cartTotal)
        })
    }, [])

    const emptyCart = () => {
        //should be removed in localstorage, redux state and from database
        //remove from local storage
        if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
        }
        //remove from redux
        dispatch({
            type: "ADD_TO_CART",
            payload: []
        })
        //remove from backend
        emptyUserCart(user.token)
            .then(res => {
                setProducts([])
                setTotal(0)
                setTotalAfterDisocunt(0)
                setCoupon("")
                toast.success("Cart is empty.Continue shopping")
            })
    }

    const saveAddressToDb = () => {
        //console.log(address)
        saveUserAddress(user.token, address).then((res) => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success("Address Saved")
            }
        })
    }

    const applyDiscountCoupon = () => {
        console.log("send coupon to backend", coupon)
        applyCoupon(user.token, coupon)
            .then(res => {
                console.log('RES OR COUPON APPLIED', res.data)
                if (res.data) {
                    setTotalAfterDisocunt(res.data)
                    //update redux coupon applied ---> True/False
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: true
                    })
                }
                //error
                if (res.data.err) {
                    setDiscountError(res.data.err)
                    //update redux coupon applied---> True/False
                    dispatch({
                        type: "COUPON_APPLIED",
                        payload: false
                    })
                }
            })

    }

    const showAddress = () => (
        <>
            <ReactQuill
                theme="snow"
                value={address}
                onChange={setAddress}
            />
            <button
                className="btn btn-primary mt-2"
                onClick={saveAddressToDb}
            >
                Save
            </button>
        </>
    )

    const showProductSummary = () => {
        return products.map((p, i) => (
            <div key={i}>
                <p>
                    {p.product.title} ({p.color}) x {p.count} = {" "}
                    {p.product.price * p.count}
                </p>
            </div>
        ))
    }

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value)
                    setDiscountError("")
                }}
                value={coupon}
                type="text"
                className="form-control"
            />
            <button
                onClick={applyDiscountCoupon}
                className="btn btn-primary mt-2"
            >
                Apply
            </button>
        </>
    )

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse ).then((res) => {
            console.log("USER CASH ORDER CREATED RES", res)
            //empty cart from redux, local storage, reset coupon, reset COD, redirect
            if (res.data.ok) {
                //empty local storage
                if (typeof window !== "undefined") {
                    localStorage.removeItem("cart");
                }
                //empty redux cart
                dispatch({
                    type: "ADD_TO_CART",
                    payload: [],
                })
                //empty redux coupon
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false
                })
                //empty redux COD
                dispatch({
                    type: "COD",
                    payload: false
                })
                //empty cart from backend
                emptyUserCart(user.token)
                //redirect
                setTimeout(() => {
                    history.push("/user/history")
                }, 1000)
            }
        })
    }

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <h4>Delivery Address</h4>
                    <br />
                    <br />

                    {showAddress()}
                    <hr />
                    <h4>Got Coupon</h4>
                    <br />
                    {showApplyCoupon()}
                    <br />
                    {discountError && <p className="bg-danger p-2">{discountError}</p>}
                </div>


                <div className="col-md-6">
                    <h4>Order Summary</h4>
                    <hr />
                    {/*JSON.stringify(products)*/}

                    <p>Products {products.length}</p>
                    <hr />
                    {showProductSummary()}
                    <hr />
                    <p>Cart Total: ${total}</p>
                    {totalAfterDiscount > 0 && (
                        <p className="bg-success p-2">
                            Discount Applied.Total payable ${totalAfterDiscount}
                        </p>
                    )}

                    <div className="row">
                        <div className="col-md-6">
                            {COD ? (
                            <button
                                className="btn btn-primary"
                                disabled={!addressSaved || !products.length}
                                onClick={createCashOrder}
                            >
                                Place Order
                            </button>) : 
                            (<button
                                className="btn btn-primary"
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push("/payment")}
                            >
                                Place Order
                            </button>)}
                        </div>

                        <div className="col-md-6">
                            <button
                                disabled={!products.length}
                                onClick={emptyCart}
                                className="btn btn-primary"
                            >
                                Empty Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckOut
