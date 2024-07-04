var body = {};

function updateProfile(btnElem) {

    body.client.name = document.getElementById('name').value;
    let date = document.getElementById('birth').value.split('-');
    body.client.birthDate = new Date(date[0], date[1] - 1, date[2]);

    btnElem.disabled = true;
    btnElem.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>'

    fetch('http://localhost:8080/auth/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response =>{
        if(response.status === 202){
            document.getElementById('alert').classList.remove('alert-danger');
            document.getElementById('alert').classList.add('alert-success');
            document.getElementById('alert').innerHTML = 'Dados atualizados com sucesso!';
            btnElem.disabled = false;
            btnElem.innerHTML = 'Salvar';
            gsap.to('#alert', {
                opacity: 1,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to('#alert', {
                            opacity: 0,
                            onComplete: () => {
                                document.getElementById('alert').classList.remove('alert-success');
                                document.getElementById('alert').classList.add('alert-danger');
                            }
                        })
                    }, 5000)
                }
            })
        }else if(response.status === 406){
            document.getElementById('alert').innerHTML = 'Erro ao atualizar dados!';
            btnElem.disabled = false
            gsap.to('#alert',{
                opacity: 1,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to('#alert', {
                            opacity: 0
                        })
                    }, 5000)
                }
            })
        } else {
            document.getElementById('alert').innerHTML = 'Erro ao atualizar dados!';
            btnElem.disabled = false
            gsap.to('#alert',{
                opacity: 1,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to('#alert', {
                            opacity: 0
                        })
                    }, 5000)
                }
            })
        }
    })



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