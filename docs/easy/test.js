var name = 'gloabl';
const obj = {
    name: 'codereasy',
    fun1() {
        (() => {
            console.log(this.name)
        })()
    },
    fun2: () => {
        console.log('this: ', this);
        console.log(this.name)
    }
}
obj.fun1();
obj.fun2();