class Form {
    steps = []
    constructor() {
        this.swiper = new Swiper(".mySwiper", {
            direction: "vertical"
        });
    }
    step(step) {
        this.steps.push(step)
        return this
    }
    input(step) {
        return `<input 
                type="date" 
                ${step.required ? 'required' : ''} 
                placeholder="${step.placeholder}"
                />`
    }
    generate(step) {
        if (!step.hasOwnProperty('type')) {
            step.type = 'input'
        }
        if (!step.hasOwnProperty('placeholder')) {
            step.placeholder = 'Cevabınızı buraya yazınız.'
        }
        let field = this[step.type](step)
        let template = document.getElementById('slide-template').innerHTML
        template = template.replace('{field}', field)
        this.swiper.appendSlide(template)
    }
    start() {
        this.generate(this.steps[0])
    }
}

const form = new Form()
form.step({
    name: 'name',
    title: 'Köylü adını giriniz.',
    required: true
}).step({
    name: 'surname',
    title: 'Köylü soyadını giriniz.',
    required: true
}).step({
    name: 'gender',
    type: 'select',
    values:{
        1: 'Kadın',
        2: 'Erkek'
    },
    required: true
})

form.start()