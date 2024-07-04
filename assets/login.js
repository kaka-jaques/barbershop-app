var body = {};

function updateProfile() {

    body.client.name = document.getElementById('name').value;

}

function constructProfile(data) {

    document.getElementById('main-login').style.display = 'none';
    document.getElementById('main-profile').style.display = 'flex';
    document.getElementById('user').value = data.user;
    if (data.user != '') document.getElementById('user').disabled = true;
    document.getElementById('profile-image').src = data.client.image_url;
    document.getElementById('name').value = data.client.name;
    document.getElementById('email').value = data.email;
    if(data.email != '')document.getElementById('email').disabled = true;
    try {
        document.getElementById('birth').value = new Date(data.client.birthDate[0], data.client.birthDate[1] - 1, data.client.birthDate[2]).toISOString().split('T')[0];
    } catch (error) {
        console.log(error);
    }
    document.getElementById('phone').value = data.client.telephone;
    if(data.client.telephone != '')document.getElementById('phone').disabled = true;
    document.getElementById('cpf').value = data.client.cpf
    if(data.client.cpf != '')document.getElementById('cpf').disabled = true;
    document.getElementById('plan-title').innerHTML = data.client.plano.name;
    document.getElementById('plan-price').innerHTML = 'R$' + data.client.plano.price;
    document.getElementById('plan-description').innerHTML = data.client.plano.description.replace(/\*/g, '<br>*');
    gsap.to('#loading-screen', {
        opacity: 0,
        duration: 1,
        onComplete: () => {

            document.getElementById('loading-screen').style.display = 'none';
        }
    })

    body = data;

}