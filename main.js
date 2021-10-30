//Form adımları. - Form steps.
const form = new Form('.mySwiper',{
    allowTouchMove: false
})
form.step({
    name: 'name',
    title: 'Adını giriniz',
    required: true,
    autofocus: true,
    beforeNext: () => {
        form.showLoader()
        setTimeout(() => {
            form.next()
        }, 1)
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
    type: 'tel',
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
    form.submit(function (response) {
        form.step({
            template: '#slide-end-template'
        }).next()
    })
})
form.start()
