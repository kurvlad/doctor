const choseCriterion=document.querySelectorAll('.chose-item');
console.log(choseCriterion);
choseCriterion.forEach((item)=> {
  item.addEventListener('click', function(event){
    item.classList.toggle('chose-item-active')

  }) 
})