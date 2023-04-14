const dropdownBtns = document.querySelectorAll('.dropdown-btn');
dropdownBtns.forEach((item) => {

  item.addEventListener('click', function (event) {
    item.parentElement.parentElement.querySelector('.dropdown-card').classList.toggle('dropdown-card-active')
    item.parentElement.parentElement.style.zIndex=item.parentElement.parentElement.style.zIndex+1;
    item.classList.toggle('dropdown-btn-active')
  })
})