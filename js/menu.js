const navbar_links = document.querySelectorAll('.navbar_link')
const product_content = document.querySelector('.product-content')
const cart_content = document.querySelector('.cart-content');

function runAnimations(index) {
    if(index === 0){
        product_content.classList.remove('activeLeft')
        cart_content.classList.remove('activeLeft')

        void product_content.offsetWidth;
        void cart_content.offsetWidth;

        product_content.classList.add('activeRight')
        cart_content.classList.add('activeRight')
    }
    else{
        product_content.classList.remove('activeRight')
        cart_content.classList.remove('activeRight')

        void product_content.offsetWidth;
        void cart_content.offsetWidth;

        product_content.classList.add('activeLeft')
        cart_content.classList.add('activeLeft')
    }
}

navbar_links.forEach((navbar_link,index) => {
    navbar_link.addEventListener('click',()=>{
        //remove all active class
        navbar_links.forEach(navbar_link => {
            navbar_link.classList.remove('active')
        })
        navbar_links[index].classList.add('active')
        runAnimations(index)
    })
})