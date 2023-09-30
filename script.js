
// helper function 

function escapeHtml(text) {
    text = "" + (text || "");
    return text.replace(/[\"&\/<>]/g, function (a) {
        return {
            '"': '&quot;', '&': '&amp;', "'": '&#39;',
            '/': '&#47;', '<': '&lt;', '>': '&gt;'
        }[a];
    });
}

// download image by url 

function downloadImage(url) {
    console.log(url)
    fetch(url)
        .then((image) => image.blob())
        // blob size and file type
        .then((finalImage) => {
            // url to download image in code format
            let tempUrl = URL.createObjectURL(finalImage);
            console.log(tempUrl, "temp url");

            const aTag = document.createElement("a");
            aTag.href = tempUrl;
            aTag.download = url.replace(/^.*[\\\/]/, "");
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);
            URL.revokeObjectURL(tempUrl);
        })
        .catch(() => {
            alert("Failed to download file!");
        });
}



// widgit code ---------------------------------------


// apis 
const APIS = {
    getTopics: 'https://api.unsplash.com/topics',
    searchPhoto: 'https://api.unsplash.com/search/photos',
}
const client_ID = 'NkSxsYeFveQ4_smLSaac4dKpuI46mOdRx9NZ3A_KrT0'
// const client_ID = '9dXl8d3QJerO9NtECI5wA6cYkw3wgtHk2fDFzSiUjGI' //pratit client id

let selectedCategory = {}
let fetchingCategoryData = false;
let fetchingCategoryImageData = false;
let fetchingSearchImageData = false;
let categoryCurrentPage = 1;
let categoryCurrentImagePage = 1;
let searchCurrentImagePage = 1;
let searchFor = ''
let screenStack = []
let selectedOrder = 'latest';


// elements 
const searchImageInput = document.querySelector('#search-image')
const backBtn = document.querySelector('#back-btn')
const filterMenu = document.querySelector('#widgit-header-menus')
const searchBtn = document.querySelector('#search-submit-btn')
const selectedCategoryContainer = document.querySelector('#selected-category-container')
const filterItems = document.querySelectorAll('.custom-dropdown-menu');

// category elements 
const categoryContainer = document.querySelector('#category-container')
const categoryLoader = document.querySelector('#category-loader')
const categoryContent = document.querySelector('#category-content')
const noMoreTopic = document.querySelector('#no-more-topic')

// category image element 
const categoryImageContainer = document.querySelector('#category-image-container')
const categoryImageLoader = document.querySelector('#category-image-loader')
const categoryImageContent = document.querySelector('#category-image-content')
const noMoreCategroyImage = document.querySelector('#no-more-category-image')

// search image element 
const searchImageContainer = document.querySelector('#search-image-container')
const searchImageLoader = document.querySelector('#search-image-loader')
const searchImageContent = document.querySelector('#search-image-content')
const noMoreSearchImage = document.querySelector('#no-more-search-image')
const searchImageError = document.querySelector('#search-error-container')


// filter button 
const filterDropdown = document.getElementById('dropdown-toggle');
const filterDropdownContent = document.getElementById('dropdown-content');
const orderByText = document.getElementById('order-by-text');


// preview 
const preview = document.querySelector('#preview')
const previewContent = document.querySelector('#preview-content')
const closePreview = document.querySelector('#close-preview')
const previewContentContainer = document.querySelector('#popup-content-container')

// icons 
const previewIcon = `
                <span class='icon'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.9833 9.99993C12.9833 11.6499 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.6499 7.0166 9.99993C7.0166 8.34993 8.34993 7.0166 9.99993 7.0166C11.6499 7.0166 12.9833 8.34993 12.9833 9.99993Z" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.99987 16.8913C12.9415 16.8913 15.6832 15.1579 17.5915 12.1579C18.3415 10.9829 18.3415 9.00794 17.5915 7.83294C15.6832 4.83294 12.9415 3.09961 9.99987 3.09961C7.0582 3.09961 4.31654 4.83294 2.4082 7.83294C1.6582 9.00794 1.6582 10.9829 2.4082 12.1579C4.31654 15.1579 7.0582 16.8913 9.99987 16.8913Z" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            `;
const downloadIcon = `
                <span class='icon'>
                    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.1792 10.8838C23.3792 11.2455 25.0942 13.4038 25.0942 18.1288V18.2805C25.0942 23.4955 23.0059 25.5838 17.7909 25.5838H10.1959C4.98091 25.5838 2.89258 23.4955 2.89258 18.2805V18.1288C2.89258 13.4388 4.58424 11.2805 8.71424 10.8955" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 2.83301V17.8597" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.9075 15.2588L13.9992 19.1671L10.0908 15.2588" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            `;



// filter menu show and hide helper
function showFilterMenu() {
    if (filterMenu) filterMenu.style.display = 'flex'
}

function hideFilterMenu() {
    if (filterMenu) filterMenu.style.display = 'none'
}

function showSelectedCategoryContainer() {
    if (selectedCategoryContainer) selectedCategoryContainer.style.display = 'flex'
}

function hideSelectedCategoryContainer() {
    if (selectedCategoryContainer) selectedCategoryContainer.style.display = 'none'
}

// screen stack 
function updateScreenStack(screen) {
    console.log(screen)
    if (screen === screenStack[screenStack.length - 1]) {
        console.log(screen === screenStack[screenStack.length - 1])
        return
    }
    screenStack.push(screen)
    console.log(screenStack)

}

// show and hide preview 
function showPreviewImage(url, name) {
    const card = createPreviewImageCard(url, name);
    if (preview) preview.style.display = 'flex'

    if (previewContent) {
        previewContent.textContent = ''
        previewContent.appendChild(card)
        previewContentContainer.classList.add('zoom-in')
        setTimeout(() => {
            previewContentContainer.classList.remove('zoom-in')
        }, 300)

    }
}
function hidePreviewImage() {


    if (preview) {
        previewContentContainer.classList.add('zoom-out')

        setTimeout(() => {
            preview.style.display = 'none'
            previewContentContainer.classList.remove('zoom-out')

        }, 300)
    }
}





// manage  category container 
function showCategory_loading(reset) {

    if (categoryImageContainer) categoryImageContainer.style.display = 'none'
    if (searchImageContainer) searchImageContainer.style.display = 'none'

    if (categoryContainer) categoryContainer.style.display = 'block'
    if (categoryLoader) categoryLoader.style.display = 'block'
    if (reset) {
        if (categoryContent) categoryContent.style.display = 'none'
    } else {
        if (categoryContent) categoryContent.style.display = 'flex'
    }

}

function showCategory_loaded() {
    updateScreenStack('category')
    hideSelectedCategoryContainer()
    setOrderToDefault()

    if (categoryImageContainer) categoryImageContainer.style.display = 'none'
    if (searchImageContainer) searchImageContainer.style.display = 'none'

    if (categoryContainer) categoryContainer.style.display = 'block'
    if (categoryLoader) categoryLoader.style.display = 'none'
    if (categoryContent) categoryContent.style.display = 'flex'
}

function showNoMoreTopic() {
    if (noMoreTopic) noMoreTopic.style.display = 'block'
}

function hideNoMoreTopic() {
    if (noMoreTopic) noMoreTopic.style.display = 'none'
}


// manage category images 
function showCategoryImage_loading(reset) {
    showSelectedCategoryContainer()
    if (categoryContainer) categoryContainer.style.display = 'none'
    if (searchImageContainer) searchImageContainer.style.display = 'none'
    if (searchImageError) searchImageError.style.display = 'none'

    if (categoryImageContainer) categoryImageContainer.style.display = 'block'
    if (categoryImageLoader) categoryImageLoader.style.display = 'block'
    if (reset) {
        if (categoryImageContent) categoryImageContent.style.display = 'none'
    } else {
        if (categoryImageContent) categoryImageContent.style.display = 'flex'
    }
}

function showCategoryImage_loaded() {
    updateScreenStack('categoryImage')
    showSelectedCategoryContainer()

    if (categoryContainer) categoryContainer.style.display = 'none'
    if (searchImageContainer) searchImageContainer.style.display = 'none'

    if (categoryImageContainer) categoryImageContainer.style.display = 'block'
    if (categoryImageLoader) categoryImageLoader.style.display = 'none'
    if (categoryImageContent) categoryImageContent.style.display = 'flex'

}

function showNoMoreCategoryImage() {
    if (noMoreCategroyImage) noMoreCategroyImage.style.display = 'block'
}

function hideNoMoreCategoryImage() {
    if (noMoreCategroyImage) noMoreCategroyImage.style.display = 'none'
}


// manage search images  result
function showSearchImage_loading(reset) {
    if (categoryContainer) categoryContainer.style.display = 'none'
    if (categoryImageContainer) categoryImageContainer.style.display = 'none'

    if (searchImageContainer) searchImageContainer.style.display = 'block'
    if (searchImageLoader) searchImageLoader.style.display = 'block'
    if (reset) {
        if (searchImageContent) searchImageContent.style.display = 'none'
    } else {
        if (searchImageContent) searchImageContent.style.display = 'flex'
    }
    hideSearchResultError()
}

function showSearchImage_loaded() {
    updateScreenStack('result')
    hideSelectedCategoryContainer()

    if (categoryContainer) categoryContainer.style.display = 'none'
    if (categoryImageContainer) categoryImageContainer.style.display = 'none'

    if (searchImageContainer) searchImageContainer.style.display = 'block'
    if (searchImageLoader) searchImageLoader.style.display = 'none'
    if (searchImageContent) searchImageContent.style.display = 'flex'


}

function showNoMoreSearchImage() {
    if (noMoreSearchImage) noMoreSearchImage.style.display = 'block'
}

function hideNoMoreSearchImage() {
    if (noMoreSearchImage) noMoreSearchImage.style.display = 'none'
}

function showSearchResultError() {
    if (searchImageLoader) searchImageLoader.style.display = 'done';
    if (searchImageContent) searchImageContent.style.display = 'none'
    hideNoMoreSearchImage()
    if (searchImageError) searchImageError.style.display = 'block'
}

function hideSearchResultError() {
    if (searchImageLoader) searchImageLoader.style.display = 'done';
    if (searchImageContent) searchImageContent.style.display = 'flex'
    hideNoMoreSearchImage()
    if (searchImageError) searchImageError.style.display = 'none'
}

// fetch data 

async function fetchCategory(page, numberOfData) {
    const headers = {
        'Authorization': `Client-ID ${client_ID}`
    };

    // parameters 
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', numberOfData)
    params.append('order_by', selectedOrder)


    const response = await fetch(`${APIS.getTopics}?${params.toString()}`, {
        headers: headers
    }).catch((error) => {
        console.error('Error fetching data:', error);
    })

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Request failed with status: ' + response.status);

    }
}

async function fetchCategoryImage(page, numberOfData, category) {
    const headers = {
        'Authorization': `Client-ID ${client_ID}`
    };

    // parameters 
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', numberOfData)
    params.append('order_by', selectedOrder)

    const response = await fetch(`${APIS.getTopics}/${category}/photos?${params.toString()}`, {
        headers: headers
    }).catch((error) => {
        console.error('Error fetching data:', error);
    })

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Request failed with status: ' + response.status);
    }
}

async function fetchSearchImage(page, numberOfData) {
    const headers = {
        'Authorization': `Client-ID ${client_ID}`
    };

    // parameters 
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('per_page', numberOfData)
    params.append('order_by', selectedOrder)
    params.append('query', searchFor)

    const response = await fetch(`${APIS.searchPhoto}?${params.toString()}`, {
        headers: headers
    }).catch((error) => {
        console.error('Error fetching data:', error);
    })

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Request failed with status: ' + response.status);

    }
}


// create cards
function createCategoryCard(categoryDetails, index) {

    const category = document.createElement('div')
    category.classList.add('card', 'category-card')
    setTimeout(() => {
        category.classList.add('zoom-in');
    }, index * 100);
    category.setAttribute('data-category', categoryDetails.slug)
    category.setAttribute('data-category_id', categoryDetails.id)
    category.setAttribute('data-category_profile', categoryDetails.cover_photo.urls.thumb)


    const categoryImage = document.createElement('img')
    categoryImage.classList.add('card-img')
    categoryImage.classList.add('category-image')
    categoryImage.setAttribute('src', categoryDetails.cover_photo.urls.thumb)
    categoryImage.setAttribute('alt', categoryDetails.title)

    const categoryName = document.createElement('span')
    categoryName.classList.add('card-title')
    categoryName.classList.add('category-name')
    categoryName.textContent = categoryDetails.title


    category.appendChild(categoryImage)
    category.appendChild(categoryName)

    return category

}

function createCategoryImageCard(categoryDetails, index) {
    const category = document.createElement('div')
    category.classList.add('card', 'category-image-card')
    setTimeout(() => {
        category.classList.add('zoom-in');
    }, index * 100);
    category.setAttribute('data-image_id', categoryDetails.id)

    //category image
    const categoryImage = document.createElement('img')
    categoryImage.classList.add('card-img', 'category-image')
    categoryImage.setAttribute('src', categoryDetails.urls.thumb)
    categoryImage.setAttribute('alt', categoryDetails.id)

    //category author text 
    const imageCredit = document.createElement('div')
    imageCredit.classList.add('image-credit')

    // author name
    const author = document.createElement('p');

    const authortext = document.createElement('span');
    authortext.classList.add('dul-text');
    authortext.textContent = escapeHtml('Photo by ');

    const authorName = document.createElement('span');
    authorName.classList.add('bold');
    authorName.textContent = escapeHtml(categoryDetails.user.first_name);


    author.appendChild(authortext);
    author.appendChild(authorName);
    imageCredit.appendChild(author);


    // copy right 
    const copyright = document.createElement('p');
    copyright.classList.add('dul-text')
    copyright.textContent = escapeHtml('on Unsplash');
    imageCredit.appendChild(copyright);

    // preview and download container 
    const hoverContent = document.createElement('div')
    hoverContent.classList.add('card-hover-content')

    // preview button 
    const previewBtn = document.createElement('button')
    previewBtn.classList.add('btn', 'prev-btn');
    previewBtn.setAttribute('data-url', categoryDetails.urls.full);
    previewBtn.setAttribute('data-author', escapeHtml(categoryDetails.user.first_name));
    previewBtn.insertAdjacentHTML('beforeend', previewIcon + 'Preview');

    // add preview functionality 
    previewBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let url = e.target.dataset.url;
        let name = e.target.dataset.author;
        showPreviewImage(url, name)
    })


    // download button 
    const downloadButton = document.createElement('button')
    downloadButton.classList.add('btn', 'download-btn');
    downloadButton.setAttribute('data-url', categoryDetails.urls.full);
    downloadButton.setAttribute('data-author', escapeHtml(categoryDetails.user.first_name));
    downloadButton.insertAdjacentHTML('beforeend', downloadIcon);


    // add download functionality 
    downloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        let url = e.target.dataset.url;
        downloadImage(url)
    })


    hoverContent.appendChild(previewBtn)
    hoverContent.appendChild(downloadButton)

    // append all in card 
    category.appendChild(categoryImage)
    category.appendChild(imageCredit)
    category.appendChild(hoverContent)

    return category


}

function createPreviewImageCard(url, name) {
    const category = document.createElement('div')
    category.classList.add('card', 'category-image-card', 'big')


    //category image
    const categoryImage = document.createElement('img')
    categoryImage.classList.add('card-img', 'category-image')
    categoryImage.setAttribute('src', url)
    categoryImage.setAttribute('alt', name)

    //category author text 
    const imageCredit = document.createElement('div')
    imageCredit.classList.add('image-credit')

    // author name
    const author = document.createElement('p');

    const authortext = document.createElement('span');
    authortext.classList.add('dul-text');
    authortext.textContent = escapeHtml('Photo by ');

    const authorName = document.createElement('span');
    authorName.classList.add('bold');
    authorName.textContent = escapeHtml(name);


    author.appendChild(authortext);
    author.appendChild(authorName);
    imageCredit.appendChild(author);


    // copy right 
    const copyright = document.createElement('p');
    copyright.classList.add('dul-text')
    copyright.textContent = escapeHtml('on Unsplash');
    imageCredit.appendChild(copyright);

    // preview and download container 
    const hoverContent = document.createElement('div')
    hoverContent.classList.add('card-hover-content')



    // download button 
    const downloadButton = document.createElement('button')
    downloadButton.classList.add('btn', 'download-btn');
    downloadButton.setAttribute('data-url', url);
    downloadButton.setAttribute('data-author', escapeHtml(name));
    downloadButton.insertAdjacentHTML('beforeend', downloadIcon);
    downloadButton.insertAdjacentHTML('beforeend', `<span class='txt'>Download Image </span>`);


    // add download functionality 
    downloadButton.addEventListener('click', function (e) {
        e.preventDefault();
        let url = e.target.dataset.url;
        downloadImage(url)
    })


    hoverContent.appendChild(imageCredit)
    hoverContent.appendChild(downloadButton)

    // append all in card 
    category.appendChild(categoryImage)
    category.appendChild(hoverContent)

    return category


}

// fetch more on scroll 
async function fetchMoreCategory() {
    if (
        categoryContainer.scrollHeight - categoryContainer.scrollTop ===
        categoryContainer.clientHeight &&
        !fetchingCategoryData
    ) {
        fetchingCategoryData = true;
        await getCategory(categoryCurrentPage, 20, false);

    }
}

async function fetchMoreCategoryImages() {
    if (
        categoryImageContainer.scrollHeight - categoryImageContainer.scrollTop ===
        categoryImageContainer.clientHeight &&
        !fetchingCategoryImageData
    ) {

        fetchingCategoryImageData = true;
        await getCategoryImage(categoryCurrentImagePage, 20, false);

    }
}

async function fetchMoreSearchImages() {
    if (
        searchImageContainer.scrollHeight - searchImageContainer.scrollTop ===
        searchImageContainer.clientHeight &&
        !fetchingSearchImageData
    ) {

        fetchingSearchImageData = true;
        await getSearchImage(searchCurrentImagePage, 20, false);

    }
}

// get and bind data 
async function getCategory(page, numberOfData, reset) {
    if (categoryContainer) {
        showCategory_loading(reset)
        hideFilterMenu()
        if (reset) categoryContent.textContent = ''
        const categoryData = await fetchCategory(page, numberOfData);
        // console.log(categoryData)
        categoryData.map((category, index) => {
            categoryContent.appendChild(createCategoryCard(category, index))
        })

        if (!reset && categoryData.length === 0) {
            showNoMoreTopic()
            fetchingCategoryData = true
        } else {
            hideNoMoreTopic()
            fetchingCategoryData = false
        }

        categoryCurrentPage = categoryCurrentPage + 1
        showCategory_loaded()
    } else {
        throw new Error('Card container not found')
    }

}

async function getCategoryImage(page, numberOfData, reset) {
    if (categoryImageContainer) {
        try {
            showCategoryImage_loading(reset)
            showFilterMenu()
            hideNoMoreSearchImage()
            hideNoMoreCategoryImage()

            if (reset) {
                categoryImageContent.textContent = ''
                hideNoMoreCategoryImage()
            }
            const particularCategoryData = await fetchCategoryImage(page, numberOfData, selectedCategory.name);
            console.log(particularCategoryData)
            particularCategoryData.forEach((category, index) => {
                categoryImageContent.appendChild(createCategoryImageCard(category, index))
            })
            if (!reset && particularCategoryData.length === 0) { //no result 
                showNoMoreCategoryImage()
                fetchingCategoryImageData = true

            } else {
                hideNoMoreCategoryImage()
                fetchingCategoryImageData = false
            }
            categoryCurrentImagePage = categoryCurrentImagePage + 1;
            showCategoryImage_loaded()
        }
        catch (err) {
            console.log(err)
        }
    }
}

async function getSearchImage(page, numberOfData, reset) {
    if (searchImageContainer) {
        try {
            showSearchImage_loading(reset)
            showFilterMenu()
            if (reset) {
                searchImageContent.textContent = ''
                hideNoMoreSearchImage()
            }
            const images = await fetchSearchImage(page, numberOfData);
            console.log(images.results)
            images.results.forEach((category, index) => {
                searchImageContent.appendChild(createCategoryImageCard(category, index))
            })
            if (!reset && images.results.length === 0) {
                showNoMoreSearchImage()
                fetchingSearchImageData = true

            } else if (reset && images.results.length === 0) {
                showSearchResultError()
                fetchingSearchImageData = false
            } else {
                hideNoMoreSearchImage()
                fetchingSearchImageData = false
                hideSearchResultError()
            }
            searchCurrentImagePage = searchCurrentImagePage + 1;
            showSearchImage_loaded()
        }
        catch (err) {
            console.log(err)
        }
    }
}


// clear search box 
function clearSearchBox() {
    searchImageInput.value = '';
}

// set order to default
function setOrderToDefault() {
    selectedOrder = 'latest'
    orderByText.textContent = 'latest'
    filterItems.forEach(item => {
        item.classList.remove('active');
    });
    filterItems[0].classList.add('active')
}

// add selected Category data 
function bindSelectedCategory() {

    const imageContainer = document.createElement('div')
    imageContainer.classList.add('image-container', 'profile')

    const image = document.createElement('img')
    image.setAttribute('src', selectedCategory.profile)
    image.setAttribute('atr', selectedCategory.name)

    const txt = document.createElement('span')
    txt.classList.add('txt')
    txt.textContent = selectedCategory.name

    imageContainer.appendChild(image)
    if (selectedCategoryContainer) {
        selectedCategoryContainer.textContent = ''
        selectedCategoryContainer.appendChild(imageContainer)
        selectedCategoryContainer.appendChild(txt)
    }
}

// event listeners 
function addEventListeners() {

    // elements 
    const allCategoryCards = document.querySelectorAll('.category-card');


    // scroll events 
    if (categoryContainer) {
        categoryContainer.addEventListener('scroll', fetchMoreCategory);
    }

    if (categoryImageContainer) {
        categoryImageContainer.addEventListener('scroll', fetchMoreCategoryImages);
    }

    if (searchImageContainer) {
        searchImageContainer.addEventListener('scroll', fetchMoreSearchImages);
    }

    // click events
    if (allCategoryCards) {
        categoryCurrentImagePage = 1
        allCategoryCards.forEach(category => {
            category.addEventListener('click', function (e) {
                selectedCategory = {
                    name: e.target.dataset.category,
                    profile: e.target.dataset.category_profile,
                }
                getCategoryImage(categoryCurrentImagePage, 20, true)
                bindSelectedCategory()
            })
        });
    }

    backBtn.addEventListener('click', () => {
        clearSearchBox()
        console.log('go to', screenStack[screenStack.length - 2])
        setOrderToDefault()
        switch (screenStack[screenStack.length - 2]) {
            case 'category': {
                showCategory_loaded();
                hideFilterMenu();
            }
                break;
            case 'categoryImage': {
                showCategoryImage_loaded();
                showFilterMenu();
            }
                break;

            default: {
                showCategory_loaded();
                hideFilterMenu();
            }
        }


    })

    filterDropdown.addEventListener('click', function () {
        filterDropdownContent.classList.toggle('open');
    });

    document.addEventListener('click', function (event) {
        if (!filterDropdownContent.contains(event.target) && !filterDropdown.contains(event.target)) {
            filterDropdownContent.classList.remove('open');
        }
    });

    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        searchFor = searchImageInput.value;
        setOrderToDefault()
        if (searchImageInput.value !== '') {
            categoryCurrentImagePage = 1;
            fetchingCategoryImageData = false
            getSearchImage(categoryCurrentImagePage, 20, true)
        }
    })

    filterItems.forEach(item => {
        item.addEventListener('click', async function () {
            filterItems.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            selectedOrder = this.getAttribute('data-order');
            console.log(selectedOrder)
            orderByText.textContent = selectedOrder;
            filterDropdownContent.classList.remove('open');
            if (screenStack[screenStack.length - 1] === 'categoryImage') {
                fetchingCategoryImageData = true;
                categoryCurrentImagePage = 1
                await getCategoryImage(categoryCurrentImagePage, 20, true);
            } else if (screenStack[screenStack.length - 1] === 'result') {
                fetchingSearchImageData = true;
                searchCurrentImagePage = 1
                await getSearchImage(categoryCurrentImagePage, 20, true);
            }


        });
    });

    closePreview.addEventListener('click', hidePreviewImage)

    // keypress events
    searchImageInput.addEventListener('keypress', async function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchFor = event.target.value
            setOrderToDefault()

            if (event.target.value !== '') {
                categoryCurrentImagePage = 1;
                fetchingCategoryImageData = true
                getSearchImage(categoryCurrentImagePage, 20, true)
            }

        }
    })



}



// build wallpaper after dom loaded 
document.addEventListener('DOMContentLoaded', async function () {
    await getCategory(categoryCurrentPage, 20, true);
    addEventListeners()



    /* full = "https://images.unsplash.com/photo-1685678281777-b1613ae7f2c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0OTgxNTN8MHwxfHRvcGljfHxNOGpWYkxiVFJ3c3x8fHx8Mnx8MTY5NDE2MDUzN3w&ixlib=rb-4.0.3&q=85"
    raw = "https://images.unsplash.com/photo-1685678281777-b1613ae7f2c2?ixid=M3w0OTgxNTN8MHwxfHRvcGljfHxNOGpWYkxiVFJ3c3x8fHx8Mnx8MTY5NDE2MDUzN3w&ixlib=rb-4.0.3"
    regulr = "https://images.unsplash.com/photo-1685678281777-b1613ae7f2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTgxNTN8MHwxfHRvcGljfHxNOGpWYkxiVFJ3c3x8fHx8Mnx8MTY5NDE2MDUzN3w&ixlib=rb-4.0.3&q=80&w=1080"
    small = "https://images.unsplash.com/photo-1685678281777-b1613ae7f2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTgxNTN8MHwxfHRvcGljfHxNOGpWYkxiVFJ3c3x8fHx8Mnx8MTY5NDE2MDUzN3w&ixlib=rb-4.0.3&q=80&w=400"
    smalls3 = "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1685678281777-b1613ae7f2c2"
    thumb = "https://images.unsplash.com/photo-1685678281777-b1613ae7f2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTgxNTN8MHwxfHRvcGljfHxNOGpWYkxiVFJ3c3x8fHx8Mnx8MTY5NDE2MDUzN3w&ixlib=rb-4.0.3&q=80&w=200"


    console.log('download thumb')
    downloadImage(thumb) */
})
