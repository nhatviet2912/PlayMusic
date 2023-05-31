/**
 * 1. Render songs => OK
 * 2. Scroll top => OK
 * 3. Play / pause / seek => OK
 * 4. CD rotate => OK
 * 5. Next / prev  => OK
 * 6. Ramdom => OK
 * 7. Next / Repeat when ended => OK
 * 8. Active song => OK (NGHĨA CÁCH KHÁC)
 * 9. Scroll active song tinto view => OK
 * 10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playList = $('.playlist');
const cd = $('.cd');
const play = $('.btn-toggle-play');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        
        {
          name: "Chia Cách Bình Yên",
          singer: "Hoài Lâm",
          path: "./assest/music/X2Download.app - CHIA CÁCH BÌNH YÊN - Hoài Lâm (cover) _ Bản live được yêu thích nhất của Hoài Lâm (128 kbps).mp3",
          image:"https://znews-photo.zingcdn.me/w660/Uploaded/aeixrdbkxq/2022_10_17/hoailam_1.jpg"
        },
        {
          name: "Vỡ Tan",
          singer: "Trịnh Thăng Bình",
          path:
            "./assest/music/VoTan.mp3",
          image: "https://icdn.dantri.com.vn/thumb_w/680/2023/03/30/trinhthangbinh2-1680139311077.jpg"
        },
        {
          name: "Sao Cũng Được",
          singer: "Thành Đạt",
          path: "./assest/music/saocungduoc.mp3",
          image:
            "https://nguoinoitieng.tv/images/nnt/106/0/bjlx.jpg"
        },
        {
          name: "Hôm Nay Em Cưới Rồi",
          singer: "Khải Đăng",
          path: "./assest/music/cuoiroi.mp3",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2rbpcj6qlYbGcWb8C_b4A3a91e36JiTuNushDhzXqsQ&s"
        },
        {
          name: "Thuyền Quyên",
          singer: "Diệu Kiên",
          path:
            "./assest/music/thuyenquyen.mp3",
          image:
            "https://photo-zmp3.zmdcdn.me/avatars/5/5/b/7/55b787b8189794c412c305027d1f239d.jpg"
        },
        {
          name: "Trái Tim Của Em Cũng Biết Đau",
          singer: "Bảo Anh",
          path: "./assest/music/traitim.mp3",
          image:
            "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/3/16/889844/Quoc-Truong-Bao-Anh--03.jpg"
        },
        {
            name: "Khu Tao Sống",
            singer: "WoWy Karik",
            path: "./assest/music/khutaosong.mp3",
            image:
            "https://media-cdn-v2.laodong.vn/storage/newsportal/2021/12/11/983678/262562421_4625160757.jpg"
        },
        {
            name: "Hai Thế Giới",
            singer: "WoWy Karik",
            path: "./assest/music/haithegioi.mp3",
            image:
            "https://media-cdn-v2.laodong.vn/storage/newsportal/2021/12/11/983678/262562421_4625160757.jpg"
        },
        {
            name: "Bật Chế Độ Bay Lên",
            singer: "Bình Gold",
            path: "./assest/music/chedobay.mp3",
            image:
            "https://hoaky68.com/wp-content/uploads/2021/02/binh-gold-la-ai.jpg"
        }
    ],

    handleEvents: function(){
        const cdWidth = cd.offsetWidth;
        const _this = this;

        //xử lý cd quay
        const cdThumAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumAnimate.pause()

        //xử lý srcoll
        document.onscroll = function(){
            const scrollTop = Math.floor(window.scrollY || document.documentElement.scrollTop);

            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;

        }

        // xử lý onclick play
        play.onclick = function(){
            console.log(_this.isPlaying);
            if(_this.isPlaying){
                audio.pause();
                cdThumAnimate.pause()

            }else{
                audio.play();
                cdThumAnimate.play()

            }
            
        }

        // xử lý khi play
        audio.onplay = function(){
            _this.isPlaying = true;
            console.log(_this.isPlaying);
            player.classList.add('playing');

        }

        // xử lý khi bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');

        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPescent = Math.floor(audio.currentTime / audio.duration * 100) ;
                progress.value = progressPescent;
            }
        }

        //khi tua
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //xử lý btn next
        btnNext.onclick = function(){
            if(_this.isRandom){
               _this.playRandomSong();
            }else{
                _this.nextSong();
                
            }
            audio.play();
            cdThumAnimate.play();
            _this.renderSong();
            _this.scrollActiveSong();
            

        }

        //xử lý btn prev
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.prevSong();

            }
            audio.play();
            cdThumAnimate.play()
            _this.renderSong();
            _this.scrollActiveSong();
        }

        //xử lý btn ramdom
        btnRandom.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.toggle("active", _this.isRandom);
        }

        //xử lý khi hết bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                btnNext.click();

            }
        }

        //xử lý repeat 
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            btnRepeat.classList.toggle("active", _this.isRepeat);
        }

        //xử lý khi click vào song
        playList.onclick = function(e){
            const nodeSong = e.target.closest('.song:not(.active)');
            //nếu k phải là active hoặc là class optins thì cho vào
            if(nodeSong || e.target.closest('.options')){
                if(nodeSong){
                    _this.currentIndex = Number(nodeSong.dataset.index);
                    _this.loadCurrentSong();
                    _this.renderSong();
                    audio.play();
                }
            }
        }

    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;

        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },

    currentSong: function(){
        return this.songs[this.currentIndex];
        // console.log(this.songs[this.currentIndex])
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong().name;
        cdThumb.style.backgroundImage = `url(${this.currentSong().image})`;
        audio.src = this.currentSong().path;
    },

    renderSong: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
            
        });
        playList.innerHTML = htmls.join('');
    },
    start: function(){
        //lấy ra bài hát đầu tiên
        this.currentSong();

        //Xử lý các sự kiện DOM
        this.handleEvents();

        //lấy ra bài hát đầu tiên hiển thị lên UI
        this.loadCurrentSong();

        //hiển thị danh sách bài hát
        this.renderSong();
    }
};

app.start();

