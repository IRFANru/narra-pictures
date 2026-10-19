'use strict';

// Satu objek = satu postingan. images boleh berisi sebanyak mungkin foto.
// Semua foto dari produk yang sama diletakkan dalam array images yang sama.
const heroFiles = ['hero-01.jpg','hero-02.jpg','hero-03.jpg','hero-04.jpg','hero-05.jpg'];

const posts = [
  {
    brand: 'Sukur',
    title: 'Susu Kurma',
    category: 'product',
    caption: 'Susu Kurma.',
    images: ['photo-01.jpg', 'photo-01_1.jpg'],
    alt: 'Susu Kurma.'
  },
  {
    brand: 'Gudeg Tidar',
    title: 'Gudeg Tidar',
    category: 'product',
    caption: 'Gudeg Tidar Purwokerto.',
    images: [
      'photo-02.jpg',
      'photo-02_1.jpg',
      'photo-02_2.jpg',
      'photo-02_3.jpg',
      'photo-02_4.jpg',
      'photo-02_5.jpg'
    ],
    alt: 'Gudeg Tidar.'
  },
  {
    brand: 'Dapur Marfa',
    title: 'Pangsit Kuah',
    category: 'product',
    caption: 'Pangsit Kuah Dapur Marfa.',
    images: ['photo-03.jpg', 'photo-03_1.jpg'],
    alt: 'Pangsit Kuah Dapur Marfa'
  },
  {
    brand: 'Tangan Bapak',
    title: 'Tangan Bapak Recipe',
    category: 'product',
    caption: 'Thai Tea, Coffee and Matcha.',
    images: [
      'photo-04.jpg',
      'photo-04_1.jpg',
      'photo-04_2.jpg',
      'photo-04_3.jpg',
      'photo-04_4.jpg',
      'photo-04_5.jpg',
      'photo-04_6.jpg'
    ],
    alt: 'Tangan Bapak Recipe'
  }
];

const gallery = document.getElementById('gallery');
const galleryHint = document.getElementById('galleryHint');
const portfolioCount = document.getElementById('portfolioCount');
const heroBackdrop = document.getElementById('heroBackdrop');
const slideStatus = document.getElementById('slideStatus');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCaption = document.getElementById('lightboxCaption');
const postCounter = document.getElementById('postCounter');
let activeFilter = 'all', availablePosts = [], visiblePosts = [], currentPostIndex = 0, currentImageIndex = 0;
let heroAvailable = [], heroIndex = 0;

function loadImage(src) { return new Promise(resolve => { const img = new Image(); img.onload=()=>resolve({src,ok:true}); img.onerror=()=>resolve({src,ok:false}); img.src=src; }); }
function postImages(post) { return post.images.map(file => `photos/${file}`); }
function createCard(post, index) {
  const button=document.createElement('button'); button.type='button'; button.className='gallery-card';
  button.setAttribute('aria-label',`Buka postingan ${post.title}`); button.dataset.category=post.category;
  const wrap=document.createElement('span'); wrap.className='gallery-image';
  const img=document.createElement('img'); img.src=`photos/${post.cover}`; img.alt=post.alt || post.title; img.loading='lazy'; wrap.appendChild(img);
  const count=document.createElement('span'); count.className='post-photo-count'; count.textContent=`▧ ${post.images.length}`; wrap.appendChild(count);
  const meta=document.createElement('span'); meta.className='gallery-meta';
  const title=document.createElement('span'); title.className='gallery-title'; title.textContent=post.title;
  const category=document.createElement('span'); category.className='gallery-category'; category.textContent=post.category.toUpperCase();
  meta.append(title,category);
  const brand=document.createElement('span'); brand.className='post-brand'; brand.textContent=post.brand;
  button.append(wrap,meta,brand); button.addEventListener('click',()=>openPost(index,0)); return button;
}
function renderGallery() {
  visiblePosts=availablePosts.filter(p=>activeFilter==='all'||p.category===activeFilter); gallery.replaceChildren();
  if(portfolioCount) portfolioCount.textContent=String(visiblePosts.length).padStart(2,'0');
  if(!visiblePosts.length){ const empty=document.createElement('div'); empty.className='gallery-empty'; const strong=document.createElement('strong'); strong.textContent='Belum ada postingan dengan foto yang tersedia'; const detail=document.createElement('span'); detail.textContent='Tambahkan nama file foto pada array images di script.js.'; empty.append(strong,detail); gallery.appendChild(empty); galleryHint.hidden=true; return; }
  visiblePosts.forEach((p,i)=>gallery.appendChild(createCard(p,i)));
  galleryHint.hidden=false; galleryHint.textContent='Setiap kartu adalah satu postingan. Klik untuk menggeser foto-foto di dalamnya.';
}
function openPost(postIndex,imageIndex) {
  if(!visiblePosts.length) return;
  currentPostIndex=(postIndex+visiblePosts.length)%visiblePosts.length;
  const post=visiblePosts[currentPostIndex]; currentImageIndex=(imageIndex+post.images.length)%post.images.length;
  lightboxImage.src=`photos/${post.images[currentImageIndex]}`; lightboxImage.alt=post.alt||post.title;
  lightboxTitle.textContent=post.title; lightboxCaption.textContent=`${post.brand} · ${post.caption}`;
  postCounter.textContent=`${currentImageIndex+1} / ${post.images.length}`;
  document.getElementById('lightboxPrev').hidden=post.images.length<2; document.getElementById('lightboxNext').hidden=post.images.length<2;
  if(!lightbox.open) lightbox.showModal();
}
function stepImage(direction) { const post=visiblePosts[currentPostIndex]; if(post) openPost(currentPostIndex,currentImageIndex+direction); }
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderGallery();}));
document.getElementById('lightboxClose').addEventListener('click',()=>lightbox.close());
document.getElementById('lightboxPrev').addEventListener('click',()=>stepImage(-1));
document.getElementById('lightboxNext').addEventListener('click',()=>stepImage(1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
document.addEventListener('keydown',e=>{if(!lightbox.open)return;if(e.key==='ArrowLeft')stepImage(-1);if(e.key==='ArrowRight')stepImage(1);});
let touchX=null; lightboxImage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX;},{passive:true});lightboxImage.addEventListener('touchend',e=>{if(touchX===null)return;const delta=e.changedTouches[0].screenX-touchX;if(Math.abs(delta)>45)stepImage(delta<0?1:-1);touchX=null;},{passive:true});
const themeToggle=document.getElementById('themeToggle'),themeIcon=document.getElementById('themeIcon');
function setTheme(theme){document.documentElement.dataset.theme=theme;themeIcon.textContent=theme==='dark'?'☾':'☼';themeToggle.setAttribute('aria-label',theme==='dark'?'Aktifkan mode terang':'Aktifkan mode gelap');}
setTheme('dark');themeToggle.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));document.getElementById('year').textContent=new Date().getFullYear();
async function startHero(){const results=await Promise.all(heroFiles.map(f=>loadImage(`photos/${f}`)));heroAvailable=results.filter(x=>x.ok).map(x=>x.src);if(!heroAvailable.length){slideStatus.textContent='ADD PHOTOS / HERO';return;}function show(i){heroIndex=i%heroAvailable.length;heroBackdrop.style.backgroundImage=`url("${heroAvailable[heroIndex]}")`;heroBackdrop.classList.add('has-image');slideStatus.textContent=`PORTFOLIO / ${String(heroIndex+1).padStart(2,'0')}`;}show(0);if(heroAvailable.length>1)window.setInterval(()=>show(heroIndex+1),4500);}
async function init(){const checked=await Promise.all(posts.map(async post=>{const results=await Promise.all(postImages(post).map(loadImage));const images=results.filter(x=>x.ok).map(x=>x.src.split('/').pop());return {...post,images,cover:images[0]||null};}));availablePosts=checked.filter(p=>p.images.length>0);renderGallery();await startHero();}
init();
