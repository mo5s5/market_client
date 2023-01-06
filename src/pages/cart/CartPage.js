import React, { useEffect, useState } from 'react'
import './cartPage.scss'
import OrderItemsList from '../../components/orderItem/OrderItemsList.js';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function CartPage(props) {

  const { cartItems, onAddToCart, onSubstract, onRemoveFromCart, setModalOpen } = props;
  const [deliveryType, setDeliveryType] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const payload = {};
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const checkFields = (fieldValue, id) => {
    if (fieldValue !== '') {
      document.getElementById(id).style.borderColor = 'rgb(174, 174, 174)';
    }
    else {
      document.getElementById(id).style.borderColor = 'red';
    }
  }

  const sendEmail = async (e) => {
    const info = JSON.parse(JSON.stringify(payload));
    const data = {
      'email': 'movses.hovhannisyan@yandex.com',
      'info': `${info.cartItems.map((item) => {
        return (
          `\n${item.name} - ${item.price} руб. 
       
          \n Количество x ${item.qty} \n
          Цена : ${item.qty * item.price}
 
          \n*********************************
          `
        )
      })}
      \n*********************************\n 
      Способ доставки : ${info.deliveryType}  \n 
      Способ оплаты : ${info.paymentType}   \n
      Имя : ${info.name} 
      Телефон: ${info.phone}
      Адресс : ${info.address}
      Комментарии :${info.comment}  
      \n К оплате:${info.cartItems.reduce((a, c) => a + c.price * c.qty, 0)} рублей
      `

    }

    axios({
      url: '/api/sendemail',
      method: 'POST',
      data: data
    })
      .then(() => {
        console.log(`Email was sent to ${data.email}`);
        console.log(cartItems[0].id);

      })
      .catch((e) => {
        console.log(e);
      });;
  };


  const onSubmit = (payload, cartItems, deliveryType, paymentType, comment, setModalOpen) => {
    payload.cartItems = cartItems;
    payload.deliveryType = deliveryType;
    payload.paymentType = paymentType;
    checkFields(name, "name");
    checkFields(phone, "phone");
    checkFields(deliveryType, 'deliveryType');
    checkFields(paymentType, 'paymentType');
    checkFields(address, 'address');

    if (paymentType !== '' && deliveryType !== '' && name !== '' && address !== '') {
      payload.cartItems = cartItems;
      payload.name = name;
      payload.address = address;
      payload.phone = phone;
      payload.deliveryType = deliveryType;
      payload.paymentType = paymentType;
      payload.comment = comment;
      sendEmail();
      setModalOpen(true);
      cartItems.length = 0;
    }
    console.log(payload);

  };

  //*  ** **  **     Rendering Part     **  **  **  */


  if (cartItems.length !== 0) {
    // console.log(cartItems);
    return (
      <div className='cartPage'>

        <div className='title'>Оформление заказа</div>

        <div className='main-content'>
          <div className='orderItem'>
            <OrderItemsList
              cartItems={cartItems}
              onAddToCart={onAddToCart}
              onSubstract={onSubstract}
              onRemoveFromCart={onRemoveFromCart}
            />
          </div>
          <div className='name fragment' id='name'>
            <div className='head'>Имя</div>
            <input type={'text'} placeholder='Андрей'
              onChange={(e) => setName(e.target.value)}></input>
          </div>


          <div className='phone fragment' id='phone'>
            <div className='head'>Телефон</div>
            <input type={'number'} placeholder='+79684687012'
              onChange={(e) => setPhone(e.target.value)}></input>
          </div>
          <div className='radio-fragment'>
            <div className='delivery-method fragment' id='deliveryType'>
              <div className='head'>Способ доставки</div>
              <label>
                <input name='delivery-type'
                  type={'radio'}
                  value='Доставка'
                  onChange={e => setDeliveryType(e.target.value)}
                />Доставка
              </label>
              <label>
                <input
                  name='delivery-type'
                  type={'radio'}
                  value='Самовывоз'
                  onChange={e => setDeliveryType(e.target.value)}
                />Самовывоз
              </label>

            </div>
            <div className='payment-method fragment' id='paymentType'>
              <div className='head'>Способ оплаты</div>

              <label>
                <input
                  name='payment-type'
                  type={'radio'} value='Оплата наличными'
                  onChange={e => setPaymentType(e.target.value)}
                />Оплата при получении

              </label>
              <label>
                <input
                  name='payment-type'
                  type={'radio'}
                  value='Онлайн оплата '
                  onChange={e => setPaymentType(e.target.value)}
                />Безналичный расчет
              </label>

            </div>
          </div>
          {deliveryType === 'Доставка' &&
            <div className='address fragment' id='address'>
              <div className='head'>Адрес</div>
              <input type={'text'} placeholder='Город, улица, дом, подъезд'
                onChange={(e) => setAddress(e.target.value)}></input>
            </div>
          }


          <div className='comment fragment'>
            <div className='head'
              onChange={e => setComment(e.target.value)}
            >Комментарии</div>
            <input type={'text'} placeholder='Ваши Комментарии'></input>
          </div>

        </div>
        <button className='submit'
          onClick={() => onSubmit(payload, cartItems, deliveryType, paymentType, comment, setModalOpen)}
        >Оформить заказ</button>


      </div>
    )

  } else {
    return (
      <div>
        <h1>В Корзине Пока Пусто</h1>
        <Link to='/' className='link'>
          Перейти К Покупкам
        </Link>
      </div>
    )
  }

}
