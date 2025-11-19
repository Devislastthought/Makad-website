// Gallery Lightbox Functionality
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-item img');

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    if (lightbox && lightboxImg) {
        lightbox.classList.add('active');
        lightboxImg.src = galleryImages[currentImageIndex].src;
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightboxImg) {
        lightboxImg.src = galleryImages[currentImageIndex].src;
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            changeImage(1);
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Video Upload and Management
let uploadedVideos = [];
const MAX_VIDEOS = 5;

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (uploadedVideos.length >= MAX_VIDEOS) {
        alert('Maximum of 5 videos can be uploaded.');
        return;
    }

    const videoURL = URL.createObjectURL(file);
    
    const videoName = prompt('Enter video name:', file.name.replace(/\.[^/.]+$/, ""));
    const videoAbout = prompt('Enter description about this challenge:');
    const videoLocation = prompt('Enter location:');
    const videoParticipants = prompt('Enter participants (comma separated):');

    const videoData = {
        url: videoURL,
        name: videoName || file.name,
        about: videoAbout || 'No description provided',
        location: videoLocation || 'Not specified',
        participants: videoParticipants || 'Not specified',
        file: file
    };

    uploadedVideos.push(videoData);
    addVideoCard(videoData, uploadedVideos.length - 1);

    if (uploadedVideos.length >= MAX_VIDEOS) {
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
            uploadSection.classList.add('hidden');
        }
    }

    event.target.value = '';
}

function addVideoCard(videoData, index) {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;
    
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
        <video class="video-thumbnail" src="${videoData.url}" muted></video>
        <div class="video-card-footer">
            <h3>${videoData.name}</h3>
            <div class="video-description">${videoData.about}</div>
            <div class="video-meta">
                <div class="video-meta-item"><strong>Location:</strong> ${videoData.location}</div>
                <div class="video-meta-item"><strong>Participants:</strong> ${videoData.participants}</div>
            </div>
            <button class="view-btn" onclick="openVideoModal(${index})">View Full Video</button>
        </div>
    `;
    
    videosGrid.appendChild(videoCard);
}

function openVideoModal(index) {
    const videoData = uploadedVideos[index];
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalVideoSource = document.getElementById('modalVideoSource');
    
    if (modal && modalVideo && modalVideoSource) {
        modalVideoSource.src = videoData.url;
        modalVideo.load();
        
        document.getElementById('videoName').textContent = videoData.name;
        document.getElementById('videoAbout').textContent = videoData.about;
        document.getElementById('videoLocation').textContent = videoData.location;
        document.getElementById('videoParticipants').textContent = videoData.participants;
        
        modal.classList.add('active');
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (modal && modalVideo) {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
}

// Close video modal on Escape key
document.addEventListener('keydown', function(e) {
    const videoModal = document.getElementById('videoModal');
    if (videoModal && videoModal.classList.contains('active') && e.key === 'Escape') {
        closeVideoModal();
    }
});

// Page Navigation with Transition
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTransition = document.querySelector('.page-transition');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only do transition for actual page links (not anchors)
            if (href && !href.startsWith('#') && pageTransition) {
                e.preventDefault();
                
                // Trigger transition
                pageTransition.classList.add('active');
                
                // Wait for transition, then navigate
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });
    
    // Remove transition on page load
    if (pageTransition) {
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 100);
    }
});

// Active navigation highlight
window.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Animate sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});

// Video thumbnail preview on hover
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        videoThumbnails.forEach(video => {
            video.addEventListener('mouseenter', function() {
                this.play();
            });
            video.addEventListener('mouseleave', function() {
                this.pause();
                this.currentTime = 0;
            });
        });
    }, 500);
});
