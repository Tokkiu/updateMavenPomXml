function p(i){
    return (i>1)&&(!(i&(i-1)));
}
console.log(p(1),p(2));