const agent = require('superagent');

const config = {
  host: 'https://api.sandbox.paypal.com',
  prefix: '/v1',
  tokenAPI: '/oauth2/token/',
  orderAPI: '/checkout/orders/'
};

const getAccessToken = async function () {
  const tokenURL = config.host + config.prefix + config.tokenAPI;
  const res = await agent.post(tokenURL)
    .set('Accept', 'application/json')
    .set('Accept-Language', 'en_US')
    .set('content-type', 'application/x-www-form-urlencoded')
    .auth('ASpv0oBiLPQe10zbsxBrtyaB54STHbyBWF1ttMwAkVYuTSuUoohsW-HmL9f7Xh6WRFZWY2Tzu-BFxxJK', 'EOBBg9smF3KqqwaiZ41xfwp_QaWpdFL6Tr-6qfvMz8S9-HOT-RXe7jOnTausaU7GD6kWWIzEbuYijdJr')
    .send({ 'grant_type': 'client_credentials' });

  console.log('response', res.body);

  const token = res.body.access_token;
  return token;
};

const createAnOrder = async function (token) {
  const orderURL = config.host + config.prefix + config.orderAPI;

  const order = await agent.post(orderURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send(
      {
        'purchase_units': [
          {
            'reference_id': 'store_mobile_world_order_1234',
            'description': 'Mobile World Store order-1234',
            'amount': {
              'currency': 'USD',
              'details': {
                'subtotal': '1.09',
                'shipping': '0.02',
                'tax': '0.33'
              },
              'total': '1.44'
            },
            'payee': {
              'email': 'seller@example.com'
            },
            'items': [
              {
                'name': 'NeoPhone',
                'sku': 'sku03',
                'price': '0.54',
                'currency': 'USD',
                'quantity': '1'
              },
              {
                'name': 'Fitness Watch',
                'sku': 'sku04',
                'price': '0.55',
                'currency': 'USD',
                'quantity': '1'
              }
            ],
            'shipping_address': {
              'line1': '2211 N First Street',
              'line2': 'Building 17',
              'city': 'San Jose',
              'country_code': 'US',
              'postal_code': '95131',
              'state': 'CA',
              'phone': '(123) 456-7890'
            },
            'shipping_method': 'United Postal Service',
            'payment_linked_group': 1,
            'custom': 'custom_value_2388',
            'invoice_number': 'invoice_number_2388',
            'payment_descriptor': 'Payment Mobile World'
          }
        ],
        'redirect_urls': {
          'return_url': 'https://example.com/return',
          'cancel_url': 'https://example.com/cancel'
        }
      }
    );
  return order.body;
};

const showOrderDetails = async function (token, orderId) {
  const orderURL = config.host + config.prefix + config.orderAPI + orderId;
  const orderDetail = await agent.get(orderURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send();
  return orderDetail.body;
};

const cancelOrder = async function (token, orderId) {
  const orderURL = config.host + config.prefix + config.orderAPI + orderId;
  const orderDetail = await agent.delete(orderURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send();
  return orderDetail.body;
};

const payForOrder = async function (token, orderId) {
  const orderURL = config.host + config.prefix + '/checkout/orders/' + orderId + '/pay';
  const paidOrder = await agent.post(orderURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send({
      disbursement_mode: 'INSTANT'
    });
  return paidOrder.body;
};

const createPayment = async function (token) {
  const paymentURL = config.host + config.prefix + '/payments/payment/';
  const payment = await agent.post(paymentURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send(
      {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "transactions": [
          {
            "amount": {
              "total": "30.11",
              "currency": "USD",
              "details": {
                "subtotal": "30.00",
                "tax": "0.07",
                "shipping": "0.03",
                "handling_fee": "1.00",
                "shipping_discount": "-1.00",
                "insurance": "0.01"
              }
            },
            "description": "The payment transaction description.",
            "custom": "EBAY_EMS_90048630024435",
            "invoice_number": "48787589673",
            "payment_options": {
              "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
            },
            "soft_descriptor": "ECHI5786786",
            "item_list": {
              "items": [
                {
                  "name": "hat",
                  "description": "Brown hat.",
                  "quantity": "5",
                  "price": "3",
                  "tax": "0.01",
                  "sku": "1",
                  "currency": "USD"
                },
                {
                  "name": "handbag",
                  "description": "Black handbag.",
                  "quantity": "1",
                  "price": "15",
                  "tax": "0.02",
                  "sku": "product34",
                  "currency": "USD"
                }
              ],
              "shipping_address": {
                "recipient_name": "Brian Robinson",
                "line1": "4th Floor",
                "line2": "Unit #34",
                "city": "San Jose",
                "country_code": "US",
                "postal_code": "95131",
                "phone": "011862212345678",
                "state": "CA"
              }
            }
          }
        ],
        "note_to_payer": "Contact us for any questions on your order.",
        "redirect_urls": {
          "return_url": "https://example.com/return",
          "cancel_url": "https://example.com/cancel"
        }
      }
    );
  return payment.body;
};

const listPayment = async function (token) {
  const paymentURL = config.host + config.prefix + '/payments/payment/';
  const payment = await agent.get(paymentURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send();
    return payment.body;
};

const showPaymentDetails = async function (token, paymentId) {
  const paymentURL = config.host + config.prefix + '/payments/payment/' + paymentId;
  const payment = await agent.get(paymentURL)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('content-type', 'application/json')
    .send();
    return payment.body;
};

const main = async function () {
  const token = await getAccessToken();
  //const order = await createAnOrder(token);
  //const orderDetail = await showOrderDetails(token, order.id);
  //const canceledOrder = await cancelOrder(token, order.id); 
  //const paidOrder = await payForOrder(token, order.id);
  const payment = await createPayment(token);
  const paymentDetails = await showPaymentDetails(token, payment.id);
  //const payments = await listPayment(token);
  1;
};


async function main2() {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
}

main2();
