class Form {
    steps = []
    current = 0
    loader = $('.loader')
    letters = ['a', 'b', 'c', 'd', 'e']
    constructor() {
        this.swiper = new Swiper(".mySwiper", {
            direction: "vertical",
            on: {
                slideChangeTransitionEnd: () => {
                    $('.swiper-slide-active .form-item').focus()
                }
            }
        });
        $(document.body).on('keyup', function (e) {
            if (e.key === 'Enter') {
                $('.swiper-slide-active fieldset:valid + .next-button').click()
            }else {
                $('.swiper-slide-active [data-key="' + e.key + '"]').click()
            }
        })
        $(document.body).on('click', '.next-button', function () {
            if ($('.swiper-slide-next').length) {
                this.swiper.slideNext()
            }else {
                if (this.steps[this.current].hasOwnProperty('beforeNext')) {
                    this.steps[this.current].beforeNext()
                } else {
                    this.next()
                }
            }
        }.bind(this))
    }
    showLoader() {
        this.loader.addClass('active')
    }
    hideLoader() {
        this.loader.removeClass('active')
    }
    next() {
        this.current += 1
        if (this.steps[this.current]) {
            this.generate(this.steps[this.current])
        }else {
            this.callback()
        }
    }
    step(step, after = false) {
        if (after) {
            this.steps = [ ... this.steps.slice(0, this.current + 1), step, ... this.steps.slice(this.current + 1)]
        }else {
            this.steps.push(step)
        }
        return this
    }
    value(input) {
        let currentStep = this.steps[this.current],
            value
        if (currentStep.type === 'radio') {
            value = $('.swiper-slide-active .form-item:checked').val()
        }else {
            value = $('.swiper-slide-active .form-item').val()
        }
        return value === input.toString()
    }
    input(step) {
        return `<input 
                class="form-item"
                type="text" 
                ${step.autofocus ? 'autofocus' : ''}
                ${step.required ? 'required' : ''} 
                placeholder="${step.placeholder}"
                />`
    }
    file(step) {
        return `<label class="upload-file">
                    <input type="file" ${step.accept ? 'accept="' + step.accept + '"' : ''} ${step.required ? 'required' : ''}>
                    <span class="text" data-invalid="${step.invalid ? step.invalid : 'Fotoğraf yüklemek için tıklayın.'}" data-valid="${step.valid ? step.valid : 'Fotoğraf başarıyla yüklendi.'}"></span>
                </label>`
    }
    textarea(step) {
        return `<textarea ${step.required ? 'required' : ''} cols="30" rows="5" placeholder="${step.placeholder}" name="${step.name}" class="form-item"></textarea>`
    }
    select(step) {
        let html = `<select class="form-item" ${step.autofocus ? 'autofocus' : ''} ${step.required ? 'required' : ''} name="${step.name}">
                <option value="">Seçin</option>`
        $.each(step.values, (key, value) => {
            html += `<option value="${key}">${value}</option>`
        })
        html += '</select>'
        return html
    }
    date(step) {
        let html = `<input class="form-item" ${step.autofocus ? 'autofocus' : ''} type="date" ${step.required ? 'required' : ''} name="${step.name}">`
        html += '</input>'
        return html
    }
    number(step) {
        let html = `<input class="form-item" ${step.autofocus ? 'autofocus' : ''} type="number" ${step.required ? 'required' : ''} name="${step.name}">`
        html += '</input>'
        return html
    }
    email(step) {
        let html = `<input class="form-item" ${step.autofocus ? 'autofocus' : ''} type="email" ${step.required ? 'required' : ''} name="${step.name}">`
        html += '</input>'
        return html
    }
    radio(step) {
        let html = ''
        let i = 0
        $.each(step.values, (key, value) => {
            html += `<label class="radio" data-key="${this.letters[i]}">
                        <input class="form-item" type="radio" ${step.required ? 'required' : ''} name="${step.name}" value="${key}">
                        <span class="text">
                        <span class="key">${this.letters[i].toUpperCase()}</span>
                        ${value}
                        </span>
                     </label>`
            i++
        })
        return html
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
        template = template
            .replace('{field}', field)
            .replace('{title}', step.title)
        this.swiper.appendSlide(template)
        this.hideLoader()
        if (this.current > 0) {
            this.swiper.slideNext()
        }
    }
    start() {
        this.generate(this.steps[this.current])
    }
    end(callback) {
        this.callback = callback
    }
}

const form = new Form()
form.step({
    name: 'name',
    title: 'Adını giriniz',
    required: true,
    autofocus: true,
    beforeNext: () => {
        form.showLoader()
        setTimeout(() => {
            form.next()
        }, 2000)
    }
}).step({
    name: 'surname',
    title: 'Soyadını giriniz',
    required: true
}).step({
    name: 'gender',
    title: 'Cinsiyetini seçiniz',
    type: 'select',
    values:{
        1: 'Kadın',
        2: 'Erkek'
    },
    required: true
}).step({
    name: 'birthday',
    title: 'Doğum tarihini giriniz',
    type: 'date',
    required: true
}).step({
    name: 'situation',
    title: 'Yaşıyor mu?',
    required: true,
    type: 'radio',
    values: {
        'evet' : 'Evet',
        'hayir' : 'Hayır'
    },
    beforeNext: function () {
        if (form.value('hayir')) {
            form.step({
                name: 'date_of_death',
                title: 'Vefat tarihini giriniz',
                type: 'date',
                required: true
            }, true)
        }
        form.next()
    }
}).step({
    name: 'profession',
    title: 'Mesleğini seçiniz',
    type: 'select',
    values: {
        1: 'Çoban',
        2: 'Çiftçi',
        3: 'Ormancı',
        4: 'Polis',
        5: 'Jandarma',
        6: 'Bekçi',
        7: 'Öğretmen',
        8: 'Diğer (Siz ekleyin)'
    },
    required: true,
    beforeNext: () => {
        if (form.value(8)) {
            form.step({
                name: 'other_profession',
                title: 'Mesleği nedir?',
                type: 'input',
                required: true
            }, true)
        }
        form.next()
    }
}).step({
    name: 'village',
    title: 'Köyünü seçiniz',
    type: 'select',
    values: {
        1: 'Ergenekon',
        2: 'Aşağıboynuyoğun',
        3: 'Yukarıboynuyoğun',
        4: 'Fındıklı',
        5: 'Kayalar',
        6: 'Tekke',
        7: 'Şenyuva',
        8: 'Diğer (Siz ekleyin)'
    },
    required: true,
    beforeNext: () => {
        if (form.value(8)) {
            form.step({
                name: 'other_village',
                title: 'Hangi köyden?',
                type: 'input',
                required: true
            }, true)
        }
        form.next()
    }
}).step({
    name: 'address',
    title: 'Adresini giriniz',
    type: 'textarea',
    required: true
}).step({
    name: 'blood',
    title: 'Kan grubunu seçiniz',
    type: 'select',
    values:{
        1: 'A+',
        2: 'A-',
        3: 'B+',
        4: 'B-',
        5: 'AB+',
        6: 'AB-',
        7: '0+',
        8: '0-',
        9: 'Bilmiyorum'
    },
    required: true
}).step({
    name: 'number',
    title: 'Telefon numarasını giriniz',
    type: 'input',
    required: true
}).step({
    name: 'email',
    title: 'Email adresini giriniz',
    type: 'email',
    required: true
}).step({
    name: 'child_have',
    title: 'Çocuğu var mı?',
    required: true,
    type: 'radio',
    values: {
        'evet' : 'Evet',
        'hayir' : 'Hayır'
    },
    beforeNext: function () {
        if (form.value('evet')) {
            form.step({
                name: 'child_name',
                title: 'Çocuklarının adını giriniz...',
                placeholder: 'Aralarına virgül koyarak yazınız...',
                type: 'textarea',
                required: true
            }, true)
        }
        form.next()
    }
}).step({
    name: 'question_photo',
    title: 'Fotoğrafı var mı?',
    required: true,
    type: 'radio',
    values: {
        'evet' : 'Evet',
        'hayir' : 'Hayır'
    },
    beforeNext: function () {
        if (form.value('evet')) {
            form.step({
                name: 'photo',
                title: 'Fotoğrafını yükleyiniz',
                accept: 'image/*',
                type: 'file',
                required: true
            }, true)
        }
        form.next()
    }
})
form.end(function () {
    console.log('bitti.')
})
form.start()
