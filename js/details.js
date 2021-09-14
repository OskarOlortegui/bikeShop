const id = new URLSearchParams(window.location.search).get('id')
const ItemName = new URLSearchParams(window.location.search).get('name')
const type = new URLSearchParams(window.location.search).get('type')

const container = document.querySelector('.details')

async function getDetails(id,type) {
    try {
        const res = await fetch(`http://localhost:8000/${type}/${id}`)
        if(!res.ok){
            throw new Error(res.statusText);
        }
        let data = await res.json()
        console.log(data)
        let template = `
        <form id='details_form' >
            <input type="hidden" name="pName" id="pName" value="${data.name}" />
            <input type="hidden" name="pPrice" id="pPrice" value="${data.price}" />
            <input type="hidden" name="pSrc" id="pSrc" value="${data.src}" />                
            <div class="cart_items">
                <div class="card">
                    <div class="card_img_container">
                        <img src="${data.src}" alt="${data.name}" class="card_img card_detail">
                    </div>
                    <div class="card_body">
                        <h4 class="card_body_title">${data.name}</h4>
                        <div>
                            <span class="card_price">$${data.price}</span>
                            <button type="submit" class="btn add_to_cart"><i class="fas fa-shopping-cart"></i></button>
                        </div>
                    </div>
                    <p class="card_desc">${data.description.slice(0,200)}...</p>
                </div>
            </div>
        </form>`;
        container.innerHTML = template
        ready() //2 - second
    
    } catch (err) {
        console.log(err, err.message)
    }
}

function displayAlert(msm,color) {
    let alert = document.querySelector('.alert');
    alert.innerHTML = `
        <div class="content">
            <div class="box-message ${color}">
                <p>${msm}</p> <i class="fas fa-times"></i>
            </div>
        </div>`;
    const closeBtn = alert.querySelector('.fas.fa-times');
    closeBtn.addEventListener('click',() => alert.innerHTML = '')
}

async function getCartItems(){
    try {
        let res = await fetch('http://localhost:8000/items')
        if(!res.ok){
            throw new Error('some error has occured')
        }
        let data = await res.json()
        return data
    } catch (err) {
        console.log(err,err.message)
    }
}

function ready() {
    const form = document.getElementById('details_form')
    form.addEventListener('submit',async (e)=>{
        e.preventDefault();
        let doc = {
            id: form.pName.value,
            name: form.pName.value,
            src: form.pSrc.value,
            price: form.pPrice.value
        }
        let arr = await getCartItems();
        //console.log(arr, doc)
        let x = arr.some(obj => obj.name === doc.name ? true : false)
        if(x){
            displayAlert("It's already in the cart this item",'yellow')
        }
        else{
            displayAlert("Added item to the cart :D",'green')
            //handling fake DB
            await fetch('http://localhost:8000/items',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(doc)
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', ()=>{
    document.title = `Details || ${ItemName}`;
    getDetails(id,type)
});