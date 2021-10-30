class Form {
    steps = []
    current = 0
    loader = $('.loader')
    letters = ['a', 'b', 'c', 'd', 'e']

    constructor(swiper, options = {}) {
        this.form = swiper
        this.swiper = new Swiper(swiper, {
            direction: "vertical",
            resistanceRatio: 0,
            ...options,
            on: {
                slideChangeTransitionEnd: () => {
                    $('.swiper-slide-active .form-item').focus()
                }
            }
        });
        $(document.body).on('keyup', function (e) {
            if (e.key === 'Enter') {
                $('.swiper-slide-active fieldset:valid + .next-button').click()
                $('.swiper-slide-active fieldset:valid .form-item').blur()
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
        if (this.steps[this.current + 1]) {
            this.current += 1
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
                name="${step.name}"
                ${step.autofocus ? 'autofocus' : ''}
                ${step.required ? 'required' : ''} 
                placeholder="${step.placeholder}"
                />`
    }
    file(step) {
        return `<label class="upload-file">
                    <input type="file" name="${step.name}" ${step.accept ? 'accept="' + step.accept + '"' : ''} ${step.required ? 'required' : ''}>
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
    tel(step) {
        let html = `<input class="form-item" ${step.autofocus ? 'autofocus' : ''} type="tel" ${step.required ? 'required' : ''} name="${step.name}">`
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
    checkbox(step) {
        let html = ''
        let i = 0
        $.each(step.values, (key, value) => {
            html += `<label class="radio" data-key="${this.letters[i]}">
                        <input class="form-item" type="checkbox" ${step.required ? 'required' : ''} name="${step.name}" value="${key}">
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
        let template
        if (step.hasOwnProperty('template')) {
            template = $(step.template).html()
        }else {
            if (!step.hasOwnProperty('type')) {
                step.type = 'input'
            }
            if (!step.hasOwnProperty('placeholder')) {
                step.placeholder = 'Cevabınızı buraya yazınız.'
            }
            let field = this[step.type](step)
            template = $('#slide-template').html()
            template = template
                .replace('{field}', field)
                .replace('{title}', step.title)
        }
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
    submit(callback) {
        $(this.form).ajaxSubmit({
            success: callback
        });
    }
}