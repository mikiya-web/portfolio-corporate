const burger = document.querySelector(".header__burger");

const drawer = document.querySelector(".header__drawer");

const overlay = document.querySelector(".header__overlay");

burger.addEventListener("click", () => {

    burger.classList.toggle("active");

    drawer.classList.toggle("active");

    overlay.classList.toggle("active");

    document.body.classList.toggle("menu-open");

});

overlay.addEventListener("click", () => {

    burger.classList.remove("active");

    drawer.classList.remove("active");

    overlay.classList.remove("active");

    document.body.classList.remove("menu-open");

});

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".news-tabs__button");
    const newsItems = document.querySelectorAll(".news-item");
    const emptyMessage = document.querySelector(".news-list__empty");
    const pagination = document.querySelector(".news-pagination");

    if (!tabButtons.length || !newsItems.length) {
        return;
    }

    const changeCategory = (selectedCategory) => {
        let visibleItemCount = 0;

        newsItems.forEach((item) => {
            item.classList.add("is-filtering");
        });

        window.setTimeout(() => {
            newsItems.forEach((item) => {
                const itemCategory = item.dataset.category;

                const shouldShow =
                    selectedCategory === "all" ||
                    selectedCategory === itemCategory;

                item.classList.toggle("is-hidden", !shouldShow);

                if (shouldShow) {
                    visibleItemCount += 1;
                }
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleItemCount !== 0;
            }

            /*
             * 今回のページネーションはダミーです。
             * 「すべて」以外では非表示にしています。
             */
            if (pagination) {
                pagination.hidden = selectedCategory !== "all";
            }

            requestAnimationFrame(() => {
                newsItems.forEach((item) => {
                    if (!item.classList.contains("is-hidden")) {
                        item.classList.remove("is-filtering");
                    }
                });
            });
        }, 180);
    };

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedCategory = button.dataset.category;

            tabButtons.forEach((tabButton) => {
                const isSelected = tabButton === button;

                tabButton.classList.toggle("is-active", isSelected);
                tabButton.setAttribute(
                    "aria-selected",
                    String(isSelected)
                );
            });

            changeCategory(selectedCategory);
        });
    });
});

/*==========================================
FAQ
==========================================*/

const faqItems = document.querySelectorAll(".contact-faq__item");

faqItems.forEach((item) => {

    const button = item.querySelector(".contact-faq__question");
    const answer = item.querySelector(".contact-faq__answer");

    button.addEventListener("click", () => {

        const isOpen = item.classList.contains("active");

        faqItems.forEach((faq) => {

            faq.classList.remove("active");

            faq.querySelector(".contact-faq__answer").style.maxHeight = null;

        });

        if (!isOpen) {

            item.classList.add("active");

            answer.style.maxHeight = answer.scrollHeight + "px";

        }

    });

});


/*==========================================
Contact Form
==========================================*/

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const tel = document.getElementById("tel");
        const message = document.getElementById("message");
        const privacy = document.getElementById("privacy");

        const errors = document.querySelectorAll(".contact-form__error");

        errors.forEach((error) => {

            error.textContent = "";

        });

        let isValid = true;

        /*=========================
        Name
        =========================*/

        if (name.value.trim() === "") {

            name.nextElementSibling.textContent = "お名前を入力してください。";

            isValid = false;

        }

        /*=========================
        Email
        =========================*/

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.value.trim() === "") {

            email.nextElementSibling.textContent = "メールアドレスを入力してください。";

            isValid = false;

        } else if (!emailPattern.test(email.value.trim())) {

            email.nextElementSibling.textContent = "メールアドレスの形式が正しくありません。";

            isValid = false;

        }

        /*=========================
        Telephone
        =========================*/

        if (tel.value.trim() !== "") {

            const telPattern = /^[0-9-]+$/;

            if (!telPattern.test(tel.value.trim())) {

                const telError = tel.parentElement.querySelector(".contact-form__error");

                if (telError) {

                    telError.textContent = "電話番号の形式が正しくありません。";

                }

                isValid = false;

            }

        }

        /*=========================
        Message
        =========================*/

        if (message.value.trim() === "") {

            message.nextElementSibling.textContent = "お問い合わせ内容を入力してください。";

            isValid = false;

        }

        /*=========================
        Privacy
        =========================*/

        const privacyError = document.querySelector(".contact-form__privacy .contact-form__error");

        if (!privacy.checked) {

            privacyError.textContent = "プライバシーポリシーへの同意が必要です。";

            isValid = false;

        } else {

            privacyError.textContent = "";

        }

        /*=========================
Success
=========================*/

        if (isValid) {

            const submitButton = document.querySelector(
                ".contact-form__button button"
            );

            submitButton.disabled = true;

            submitButton.innerHTML = `
<div class="contact-form__loading"></div>
<span class="contact-form__loading-text">送信中...</span>
`;

            submitButton.style.cursor = "default";

            setTimeout(() => {

                window.location.href = "./contact-thanks.html";

            }, 1000);

        }

    });

}