function initCarousel(selector, options)
{
    let self = this;
    self.selector = selector;
    self.slider = document.querySelectorAll(self.selector);
    self.options = options;

    if (!self.slider.length) return;

    for (let i = 0; i < self.slider.length; i++)
    {
        let gallery = new Swiper(self.slider[i], self.options);
    }
}

initCarousel(
    '.slider-curator',
    {
        // loop: true,
        speed: 300,
        pagination: {
            el: '.pagination-bullets-box',
            type: 'bullets',
            clickable: true
        },
        navigation: {
          prevEl: '[data-button="slider-curator-prev"]',
          nextEl: '[data-button="slider-curator-next"]',
        },
        slidesPerView: "auto",
        breakpoints: {
            320: {
                spaceBetween: 12
            },
            1024: {
                spaceBetween: 30
            }
        }
    }
);

let resolve = false;

function GroupBox(btn, box, substrate) {
    let self = this;
    self.btn = document.querySelector(btn);
    self.btn.setAttribute('data-group-btn','btn');
    self.box = document.querySelector(box);
    self.box.setAttribute('data-group-box','box');
    self.substrate = document.querySelector(substrate);
    self.substrate.setAttribute('data-group-substrate','substrate');
    self.transition = 300;

    self.box.style.transition = self.transition + 'ms';
    self.substrate.style.transition = self.transition + 'ms';

    self.btn.box = self.box;

    self.listBtn = null;
    self.listBox = null;

    self.change = function(btn) {
        if (resolve) return;

        self.listBtn = document.querySelectorAll('[data-group-btn]');
        self.listBox = document.querySelectorAll('[data-group-box]');

        let indBtn = false;
        let indCurrentOpen = btn.classList.contains('open');

        for (let i = 0; i < self.listBtn.length; i++) {
            if (self.listBtn[i].classList.contains('open')) {
                indBtn = true;
                self.closeBtn(self.listBtn[i]);
                self.closeBox(self.listBtn[i].box);
            }
        }

        if (!indBtn) {
            self.openSubstrate();
            self.openBtn(btn);
            self.openBox(btn.box, 0);
        } else if (indBtn && indCurrentOpen) {
            self.closeSubstrate();
            self.closeBtn(btn);
            self.closeBox(btn.box);
        } else if (indBtn && !indCurrentOpen) {
            self.openBtn(btn);
            self.openBox(btn.box, self.transition);
        }
    }

    self.openSubstrate = function() {
        self.substrate.style.display = 'block';

        setTimeout(function () {
            self.substrate.classList.add('open');
        },0);
    }

    self.closeSubstrate = function() {
        self.substrate.classList.remove('open');

        setTimeout(function () {
            self.substrate.style.display = 'none';
        },self.transition);
    }

    self.openBtn = function (btn) {
        btn.classList.add('open');
    }

    self.closeBtn = function (btn) {
        btn.classList.remove('open');
    }

    self.openBox = function (box, transition) {
        box.style.display = 'block';

        setTimeout(function () {
            box.classList.add('open');
        },transition);
    }

    self.closeBox = function (box) {
        box.classList.remove('open');
        resolve = true;

        setTimeout(function () {
            box.style.display = 'none';

            resolve = false;
        },self.transition);
    }

    self.closeCurrentBox = function () {
        self.closeBtn(self.btn);
        self.closeBox(self.btn.box);
        self.closeSubstrate();
    }

    self.init = function () {
        self.btn.addEventListener('click', function() {
            self.change(this);
        });

        self.substrate.addEventListener('click', function() {
            self.closeBtn(self.btn);
            self.closeBox(self.btn.box);
            self.closeSubstrate();
        });
    }

    self.init();

    return {
        closeCurrentBox: self.closeCurrentBox
    }
}

function handleAddGroupBox(btn,box,substrate) {
    if (document.querySelector(btn) &&
        document.querySelector(box) &&
        document.querySelector(substrate))
    {
        return new GroupBox(btn, box, substrate);
    }
}

handleAddGroupBox('[data-button="header-user"]', '[data-popup="log in"]', '.substrate');

handleAddGroupBox('[data-button="forgot password"]', '[data-popup="forgot password"]', '.substrate');

handleAddGroupBox('[data-button="registration"]', '[data-popup="registration"]', '.substrate');

handleAddGroupBox('[data-button="header-search"]', '[data-popup="search"]', '.substrate');

let mobMenu = handleAddGroupBox('[data-button="menu"]', '[data-popup="menu"]', '.substrate');

function startup(node, substrate) {
    let self = this;
    self.node = document.querySelector(node);
    self.substrate = document.querySelector(substrate);
    self.node.addEventListener("touchstart", handleStart, false);
    self.node.addEventListener("touchend", handleEnd, false);
    self.node.addEventListener("touchmove", handleMove, false);

    let ongoingTouches = [];
    let startPoint = null;
    let endPoint = null;

    function handleStart(evt) {
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.push(touches[i]);
        }

        startPoint = ongoingTouches[ongoingTouches.length -1].pageX;
    }

    function handleEnd(evt) {
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.push(touches[i]);
        }

        endPoint = ongoingTouches[ongoingTouches.length -1].pageX;

        self.node.style.transform = null;
        self.node.style.transition = "300ms";
        closeMenu();
    }

    function handleMove(evt) {
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.push(touches[i]);
        }

        endPoint = ongoingTouches[ongoingTouches.length -1].pageX;

        let moveLength = startPoint - endPoint;

        if (moveLength > 0) {
            self.node.style.transform = "translateX(calc(0% - " + moveLength + "px))";
            self.node.style.transition = "0ms";
        }
    }

    function closeMenu() {
        if (startPoint - endPoint >= 70) {
            mobMenu.closeCurrentBox();
        }
    }
}

startup('[data-popup="menu"]', '.substrate');