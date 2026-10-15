"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // ===== スマホメニュー =====
    const burger = document.querySelector(".header__burger");
    const drawer = document.querySelector(".header__drawer");
    const overlay = document.querySelector(".header__overlay");

    if (burger && drawer && overlay) {
        burger.type = "button";
        drawer.id = "header-drawer";
        burger.setAttribute("aria-controls", drawer.id);

        function setMenuOpen(isOpen) {
            burger.classList.toggle("active", isOpen);
            drawer.classList.toggle("active", isOpen);
            overlay.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);

            burger.setAttribute("aria-expanded", String(isOpen));
            burger.setAttribute(
                "aria-label",
                isOpen ? "メニューを閉じる" : "メニューを開く"
            );

            drawer.inert = !isOpen;
            drawer.setAttribute("aria-hidden", String(!isOpen));
        }

        burger.addEventListener("click", () => {
            setMenuOpen(!burger.classList.contains("active"));
        });

        overlay.addEventListener("click", () => {
            setMenuOpen(false);
            burger.focus();
        });

        drawer.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenuOpen(false));
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                burger.classList.contains("active")
            ) {
                setMenuOpen(false);
                burger.focus();
            }
        });

        window.matchMedia("(max-width: 1024px)")
            .addEventListener("change", () => setMenuOpen(false));

        setMenuOpen(false);
    }

    // ===== お知らせのカテゴリー絞り込み =====
    const tabButtons = document.querySelectorAll(".news-tabs__button");
    const newsItems = document.querySelectorAll(".news-item");
    const emptyMessage = document.querySelector(".news-list__empty");
    const pagination = document.querySelector(".news-pagination");

    if (tabButtons.length && newsItems.length) {
        let filterTimer;

        function changeCategory(selectedCategory) {
            // 連続操作時は前の予約を取り消す
            clearTimeout(filterTimer);

            newsItems.forEach((item) => {
                item.classList.add("is-filtering");
            });

            filterTimer = window.setTimeout(() => {
                let visibleItemCount = 0;

                newsItems.forEach((item) => {
                    const shouldShow =
                        selectedCategory === "all" ||
                        selectedCategory === item.dataset.category;

                    item.classList.toggle("is-hidden", !shouldShow);
                    item.classList.remove("is-filtering");

                    if (shouldShow) visibleItemCount++;
                });

                if (emptyMessage) {
                    emptyMessage.hidden = visibleItemCount !== 0;
                }

                if (pagination) {
                    pagination.hidden = selectedCategory !== "all";
                }
            }, 180);
        }

        tabButtons.forEach((button) => {
            button.type = "button";

            button.addEventListener("click", () => {
                tabButtons.forEach((tabButton) => {
                    const isSelected = tabButton === button;
                    tabButton.classList.toggle("is-active", isSelected);
                    tabButton.setAttribute(
                        "aria-selected",
                        String(isSelected)
                    );
                });

                changeCategory(button.dataset.category);
            });
        });
    }

    // ===== FAQ =====
    const faqItems = document.querySelectorAll(".contact-faq__item");

    function updateFaq(item) {
        const button = item.querySelector(".contact-faq__question");
        const answer = item.querySelector(".contact-faq__answer");
        if (!button || !answer) return;

        const isOpen = item.classList.contains("active");
        button.setAttribute("aria-expanded", String(isOpen));
        answer.setAttribute("aria-hidden", String(!isOpen));
        answer.style.maxHeight = isOpen
            ? `${answer.scrollHeight}px`
            : "";
    }

    faqItems.forEach((item, index) => {
        const button = item.querySelector(".contact-faq__question");
        const answer = item.querySelector(".contact-faq__answer");
        if (!button || !answer) return;

        button.type = "button";
        answer.id = `contact-faq-answer-${index + 1}`;
        button.setAttribute("aria-controls", answer.id);
        updateFaq(item);

        button.addEventListener("click", () => {
            const wasOpen = item.classList.contains("active");

            faqItems.forEach((faq) => {
                faq.classList.remove("active");
                updateFaq(faq);
            });

            if (!wasOpen) {
                item.classList.add("active");
                updateFaq(item);
            }
        });
    });

    window.addEventListener("resize", () => {
        faqItems.forEach(updateFaq);
    });

    // ===== お問い合わせフォーム（送信しないデモ） =====
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const nameInput = contactForm.querySelector("#name");
        const emailInput = contactForm.querySelector("#email");
        const telInput = contactForm.querySelector("#tel");
        const messageInput = contactForm.querySelector("#message");
        const privacyInput = contactForm.querySelector("#privacy");
        const submitButton = contactForm.querySelector(
            ".contact-form__button button"
        );

        if (
            !nameInput ||
            !emailInput ||
            !telInput ||
            !messageInput ||
            !privacyInput ||
            !submitButton
        ) {
            return;
        }

        const fields = [
            nameInput,
            emailInput,
            telInput,
            messageInput,
            privacyInput
        ];

        function getErrorElement(input) {
            return input.closest(
                ".contact-form__group, .contact-form__privacy"
            ).querySelector(".contact-form__error");
        }

        fields.forEach((input) => {
            const error = getErrorElement(input);
            error.id = `${input.id}-error`;
            error.setAttribute("aria-live", "polite");
            input.setAttribute("aria-describedby", error.id);
        });

        [nameInput, emailInput, messageInput, privacyInput].forEach(
            (input) => {
                input.required = true;
            }
        );

        function setError(input, message) {
            getErrorElement(input).textContent = message;
            input.setAttribute("aria-invalid", "true");
        }

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            fields.forEach((input) => {
                getErrorElement(input).textContent = "";
                input.removeAttribute("aria-invalid");
            });

            if (nameInput.value.trim() === "") {
                setError(nameInput, "お名前を入力してください。");
            }

            const email = emailInput.value.trim();

            if (email === "") {
                setError(emailInput, "メールアドレスを入力してください。");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError(emailInput, "メールアドレスの形式が正しくありません。");
            }

            const tel = telInput.value.trim();

            if (tel !== "" && !/^[0-9]+(?:-[0-9]+)*$/.test(tel)) {
                setError(
                    telInput,
                    "電話番号は半角数字と、数字の間のハイフンで入力してください。"
                );
            }

            if (messageInput.value.trim() === "") {
                setError(messageInput, "お問い合わせ内容を入力してください。");
            }

            if (!privacyInput.checked) {
                setError(privacyInput, "デモであることを確認してください。");
            }

            const firstInvalidInput = fields.find(
                (input) => input.getAttribute("aria-invalid") === "true"
            );

            if (firstInvalidInput) {
                firstInvalidInput.focus();
                return;
            }

            // 通信や保存は行わず、デモ完了ページへ移動
            submitButton.disabled = true;
            window.location.href = "./contact-thanks.html";
        });

        // ブラウザの「戻る」で再表示された場合にも操作可能にする
        window.addEventListener("pageshow", () => {
            submitButton.disabled = false;
        });
    }
});