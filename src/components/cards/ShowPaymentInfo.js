import React from 'react';

const ShowPaymentInfo = ({order, showStatus = true}) => {
    return (
        <div>
            <p>
                <span>Order Id: {order.paymentIntent.id}</span>{" "}
                <br />
                <span>Amount: {(order.paymentIntent.amount /= 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: "USD"
                })}
                </span>{" "}
                <br />
                <span>Currency: {order.paymentIntent.currency.toUpperCase()}</span>{" "}
                <br />
                <span>Method: {order.paymentIntent.payment_method_types[0]}</span>{" "}
                <br />
                <span>Payment: {order.paymentIntent.status.toUpperCase()}</span>{" "}
                <br />
                <span>
                    Ordered on: {" "}
                    {new Date(order.paymentIntent.created * 1000).toLocaleString()}
                </span>{" "}
                <br />
                {order && order.orderdBy && order.orderdBy.address && (<span>
                    Address: {" "}
                    {order.orderdBy.address}
                </span>)}{" "}
                <br />
                {showStatus && (<span className="badge bg-primary text-white">
                    STATUS: {order.orderStatus}
                </span>)}
                <br />
            </p>
        </div>
    )
}

export default ShowPaymentInfo
