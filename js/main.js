"use strict";
import images from "./gallery-items.js";

const refs = {
  gallaryList: document.querySelector(".js-gallery"),
  modal: document.querySelector(".js-lightbox"),
  largeImg: document.querySelector(".lightbox__image"),
  closeModalBtn: document.querySelector('button[data-action="close-lightbox"]'),
  overlay: document.querySelector(".lightbox__content"),
};

createGallery();

refs.gallaryList.addEventListener("click", onGalleryItemClick);
refs.closeModalBtn.addEventListener("click", onCloseModal);
refs.overlay.addEventListener("click", onOverlayClick);

function createGallery() {
  const makeTree = images.map((image) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("gallery__link");
    a.setAttribute("href", image.original);

    const img = document.createElement("img");
    img.classList.add("gallery__image");
    img.setAttribute("src", image.preview);
    img.setAttribute("data-source", image.original);
    img.setAttribute("alt", image.description);

    a.appendChild(img);
    li.appendChild(a);

    return li;
  });

  refs.gallaryList.append(...makeTree);
}

function onGalleryItemClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== "IMG") {
    return;
  }

  openModal();

  const imageRef = event.target;
  const largeImageURL = imageRef.dataset.source;
  const largeImageAlt = imageRef.alt;

  setLargeImageSrc(largeImageURL);
  setLargeImageAlt(largeImageAlt);
}

function setLargeImageSrc(url) {
  refs.largeImg.src = url;
}

function getLargeImageSrc() {
  return refs.largeImg.getAttribute("src");
}

function setLargeImageAlt(alt) {
  refs.largeImg.alt = alt;
}

function openModal() {
  window.addEventListener("keydown", onPressHandler);
  refs.modal.classList.add("is-open");
}

function onCloseModal() {
  window.removeEventListener("keydown", onPressHandler);
  refs.modal.classList.remove("is-open");
  deleteLargeImageSrc();
}

function deleteLargeImageSrc() {
  refs.largeImg.src = "";
}

function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

function onPrevClick() {
  const curSrc = getLargeImageSrc();
  let current = images.findIndex((el) => el.original === curSrc);
  if (current === 0) {
    current = images.length;
  }
  const newIndex = images.find((el, i) => i === current - 1);
  setLargeImageSrc(newIndex.original);
}

function onNextClick() {
  const curSrc = getLargeImageSrc();
  let current = images.findIndex((el) => el.original === curSrc);
  if (current === images.length - 1) {
    current = -1;
  }
  const newIndex = images.find((el, i) => i === current + 1);
  setLargeImageSrc(newIndex.original);
}

function onPressHandler(event) {
  if (event.code === "Escape") {
    onCloseModal();
  }
  if (event.code === "ArrowLeft") {
    onPrevClick();
  }
  if (event.code === "ArrowRight") {
    onNextClick();
  }
}