let gridBike = document.querySelector('.grid.bike')
let gridMotorbike = document.querySelector('.grid.motorbike')

/*//// Displaying from fake DB /////*/
function displayCards(data,type) {
    let output = '';
    for (let i = 0; i < data.length; i++) {
        const card = data[i];
        output += `
        <form class="form">
            <input type="hidden" name="pName" value="${card.name}"/>
            <input type="hidden" name="pSrc" value="${card.src}" />
            <input type="hidden" name="pPrice" value="${card.price}" />
            <div class="card">
                <div class="card_img_container">
                    <img src="${card.src}" alt="${card.name}" class="card_img">
                </div>
                <div class="card_body">
                    <h4 class="card_body_title">${card.name}</h4>
                    <div>
                        <span class="card_price">$${card.price}</span>
                        <button type="submit" class="btn add_to_cart"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
                <div class="card_details_link">
                    <a class="btn details_btn" href="details.html?id=${card.id}&name=${card.name}&type=${type}" role="button">Read more</a>
                </div>
            </div>
        </form>`;
    }
    return output
}

function mainFunc(b_state,mb_state) {
    gridBike.innerHTML = displayCards(b_state.data, b_state.type);
    gridMotorbike.innerHTML = displayCards(mb_state.data, mb_state.type);
}

async function getProducts() {
    try {
        let b_res = await fetch('http://localhost:8000/bikes')
        let mb_res = await fetch('http://localhost:8000/motorbikes')
        if(!b_res.ok || !mb_res.ok){
             throw new Error('Error has occurred');
         }
        let b_data = await b_res.json()
        let mb_data = await mb_res.json()
        let b_state = {
            data: b_data,
            type: 'bikes'
        }
        let mb_state = {
            data: mb_data,
            type: 'motorbikes'
        }
        mainFunc(b_state,mb_state)
        ready()// 2 - Second
    } catch (err) {
     console.log(err,err.message)
    } 
}

/*/// Adding to cart Section ///*/

    /* ---- general functions ---- */
    function updateTotal() {
        let cart_items = document.querySelector('.cart_items');
        let cart_item = cart_items.querySelectorAll('.cart_item');
        let total = 0;
        for (let i = 0; i < cart_item.length; i++) {
            let elementPrice = parseFloat(cart_item[i].querySelector('.cart_item_price').innerText.replace('$',''));
            let elementQuantity = cart_item[i].querySelector('.quantity').value;

            total = total + (elementPrice * elementQuantity)
        }
        total = total.toFixed(2)
        document.querySelector('.total_amount').innerHTML = `$${total}`
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
    
    async function deleteItem() {
        let parent = this.parentNode;
        parent.remove()
        updateTotal();
        let name = parent.querySelector('.cart_item_name').innerText;
            //console.log(name)
        await fetch('http://localhost:8000/items/' + name, {
            method: 'DELETE'
        })
    }
    
    function setChange(e) {
        let input = e.target;
        if(isNaN(input.value) || input.value <= 0) input.value = 0
        updateTotal()
    }
    
    function addOne(father) {
        let currVal = +father.querySelector('.quantity').value;
        father.querySelector('.quantity').value = currVal + 1;
        updateTotal()
    }
    
    function substractOne(father) {
        let currVal = +father.querySelector('.quantity').value;
        if(currVal <= 1) father.querySelector('.quantity').value = 1;
        else{
            father.querySelector('.quantity').value = currVal - 1;
            updateTotal()
        }
    }
    /* ---- END of general functions ----*/

function addToCart({name,src,price}) {
    let cart_items = document.querySelector('.cart_items')

    let cart_item = document.createElement('div')
    cart_item.classList.add('cart_item')
    let row = `
        <div class="cart_item_img_container">
            <img src="${src}" alt="${name}" class="cart_item_img">
        </div>
        <h3 class="cart_item_name">${name}</h3>
        <div class="cart_item_actions">
            <i class="fas fa-minus-square"></i>
            <input type="text" class="quantity" value="1">
            <i class="fas fa-plus-square"></i>
        </div>
        <h3 class="cart_item_price">$${price}</h3>
        <button class="btn btn-delete"><i class="fas fa-trash"></i></button>`;
    cart_item.innerHTML = row
    cart_items.append(cart_item)
    displayAlert("Added item to the cart :D",'green')

        /*delete and quantity actions*/
        cart_item.querySelector('.btn.btn-delete').addEventListener('click', deleteItem)
        cart_item.querySelector('.quantity').addEventListener('change', setChange)  
        cart_item.querySelector('.fa-plus-square').addEventListener('click', ()=> addOne(cart_item))
        cart_item.querySelector('.fa-minus-square').addEventListener('click', ()=> substractOne(cart_item))    
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

async function handleInfo(e) {
    e.preventDefault();
    console.log('this', this) //the current .form
    //get the input:hidden values
    let doc = {
        id: this.pName.value,
        name: this.pName.value,
        src: this.pSrc.value,
        price: this.pPrice.value
    }

    let arr = await getCartItems(); //with await we get the arr
    let x = arr.some(obj => obj.name === doc.name ? true : false)

    if(x){
        displayAlert("It's already in the cart this item",'yellow')
    }
    else{
        //handling fake DB
        await fetch('http://localhost:8000/items',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(doc)
        })
        //handling UI
        addToCart(doc)
        updateTotal()
    }
}

function ready() {
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
        form.addEventListener('submit',handleInfo)
    })
}

//3 - Third
/*When the pages Reloads I
    Want to keep the cart list So...
*/
function displayCartItems(data) {
    let cart_items = document.querySelector('.cart_items')
    let output = ''
    for (let i = 0; i < data.length; i++) {
        const cart_item = data[i];
        output += `
        <div class="cart_item">
            <div class="cart_item_img_container">
                <img src="${cart_item.src}" alt="${cart_item.name}" class="cart_item_img">
            </div>
            <h3 class="cart_item_name">${cart_item.name}</h3>
            <div class="cart_item_actions">
                <i class="fas fa-minus-square"></i>
                <input type="text" class="quantity" value="1">
                <i class="fas fa-plus-square"></i>
            </div>
            <h3 class="cart_item_price">$${cart_item.price}</h3>
            <button class="btn btn-delete"><i class="fas fa-trash"></i></button>
        </div>`;
    }
    cart_items.innerHTML = output;
    //deleteReq();
    updateTotal();
    let trashBtns = cart_items.querySelectorAll('.btn.btn-delete')
    trashBtns.forEach(trashBtn => trashBtn.addEventListener('click',deleteItem))

    let quantities = cart_items.querySelectorAll('.quantity')
    quantities.forEach(quantity => {
        quantity.addEventListener('change', setChange)
    })

    let all_cart_items = document.querySelectorAll('.cart_item');
    all_cart_items.forEach(single_cart_item => {
        single_cart_item.querySelector('.fas.fa-plus-square').addEventListener('click',()=> addOne(single_cart_item))
        single_cart_item.querySelector('.fas.fa-minus-square').addEventListener('click',()=> substractOne(single_cart_item))
    })
}

window.addEventListener('DOMContentLoaded', async ()=>{
    getProducts()
    let arr = await getCartItems();
    if(arr.length>0) displayCartItems(arr)
})