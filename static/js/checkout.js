
if (shipping == 'False'){
    document.getElementById('shipping-info').innerHTML = ''
}

if (user != 'AnonymousUser'){
    document.getElementById('user-info').innerHTML = ''
}

if (shipping == 'False' && user != 'AnonymousUser'){
    document.getElementById('form-wrapper').classList.add('hidden');
    document.getElementById('payment-info').classList.remove('hidden');

}


var form = document.getElementById('form')
form.addEventListener('submit', function(e){
    e.preventDefault()
    console.log('Form submitted...')
    document.getElementById('form-button').classList.add('hidden')
    document.getElementById('payment-info').classList.remove('hidden')
})

//document.getElementById('make-payment').addEventListener('click', function(e){
//    submitFormData()
//
//}
//)

function makePayment() {

  // Get the email from the user form

  if(email == '') {
    email = form.email.value;
  }

  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-SANDBOXDEMOKEY-X",
    tx_ref: order_id,
    amount: total,
    currency: "NGN",
    payment_options: "card",
//    redirect_url: "/",
    meta: {
      consumer_id: 23,
      consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
      email: email,
      phone_number: "08102909304",
      name: "Rose DeWitt Bukater",
    },
    customizations: {
      title: "The Titanic Store",
      description: "Payment for an awesome cruise",
      logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
    },

    callback: function(payment) {
       // Send AJAX verification request to backend
//       verifyTransactionOnBackend(payment.id);
       submitFormData();
//       modal.close();
     },

  });
}

function submitFormData(){
    console.log('Form Data Submitting..')


    var userFormData = {
        'name':null,
        'email':null,
        'total':total,
        'order_id':order_id,
    }

    var shippingInfo = {
        'address':null,
        'city':null,
        'state':null,
        'zipcode':null
    }

    if(shipping != 'False'){
        shippingInfo.address = form.address.value
        shippingInfo.city = form.city.value
        shippingInfo.state = form.state.value
        shippingInfo.zipcode = form.zipcode.value
    }

    if(user == 'AnonymousUser'){
        userFormData.name = form.name.value
        userFormData.email = form.email.value
    }

    var url = '/process_order/'
    fetch(url, {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'form': userFormData, 'shipping': shippingInfo})
    })
    .then((response) => {response.json()})
    .then((data) => {
        console.log('Success:', data)

        cart = {}
        document.cookie = 'cart=' + JSON.stringify(cart) + ';domain=;path=/'
        console.log('Cart:', cart)
        alert('Transaction completed');
        window.location.href = '/';
    })

}
