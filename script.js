// ... existing code ...
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Declare canvas and context variables in a higher scope
let handwritingCanvas;
let ctx;
let isCanvasReady = false; // Add an initialization flag
let noteData = {}; // Ensure noteData is globally accessible
let activeTabId = null;
function saveCanvasState(tabId) {
    if (!tabId || !handwritingCanvas) return;
    noteData[tabId] = handwritingCanvas.toDataURL();
    console.log(`Saved state for ${tabId}`);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const homePage = document.getElementById('home-page');
    const notesGrid = document.getElementById('notes-container');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.querySelector('.menu-toggle');
    const mainContent = document.querySelector('.home-main-content');
    
    const homeIcon = document.querySelector('.home-icon'); 
    const libraryIcon = document.querySelector('.library-icon'); 
    const documentViewerPage = document.getElementById('document-viewer-page');
    const documentTabs = document.querySelector('.document-tabs'); // 新增
    const docContentPanels = document.querySelectorAll('.doc-content-panel'); // 新增
    const tagsList = document.querySelector('.tags-list');
    // REMOVE: const viewAllNotesLink = document.getElementById('view-all-notes-link');
    const allNotesPage = document.getElementById('all-notes-page');
    const tutorPage = document.getElementById('tutor-page');
    const virtualClassroomPage = document.getElementById('virtual-classroom-page');
    const allNotesGrid = document.getElementById('all-notes-grid');
    const fileManagerPage = document.getElementById('file-manager-page');
    const trackingPage = document.getElementById('tracking-page');
    const settingsPage = document.getElementById('settings-page');
    const importPage = document.getElementById('import-page');
    const handwritingPage = document.getElementById('handwriting-page');
    const capturePage = document.getElementById('capture-page');
    const cameraPage = document.getElementById('camera-page');
    const microphonePage = document.getElementById('microphone-page');
    const knowledgeMapPage = document.getElementById('knowledge-map-page');
    const vcHistoryPage = document.getElementById('vc-history-page');
    const aiCreationPage = document.getElementById('ai-creation-page');
    const aiCreationCta = document.getElementById('ai-creation-cta');
    const toggleSelectionPanelBtn = document.getElementById('toggle-selection-panel-btn'); // New
    const selectedNotesPanel = document.querySelector('.selected-notes-panel'); // New

    // New top nav icons
    const multiSelectIcon = document.querySelector('.multi-select-icon');
    let multiSelectMode = false;
    // const searchIcon = document.querySelector('.user-menu .fa-search');
    // const globalSearchOverlay = document.getElementById('global-search-overlay');
    // const globalSearchInput = document.getElementById('global-search-input');
    const closeSearchBtn = document.getElementById('close-search-btn');

    // New search elements
    const searchContainer = document.querySelector('.search-container');
    const searchIconOnly = document.querySelector('.search-icon-only');
    const searchInput = document.querySelector('.search-input');
    const layerButton = document.querySelector('.toolbar-button[title="图层"]');
    const tabListBtn = document.querySelector('.tab-list-btn');
    const tabsDropdown = document.querySelector('.tabs-dropdown');

    // New Element Selectors for sidebar navigation
    const allFilesLink = document.getElementById('all-files-link');
    const favoritesLink = document.getElementById('favorites-link');
    const trashLink = document.getElementById('trash-link');

    // REMOVE: const fileManagerLink = document.getElementById('file-manager-link');
    // REMOVE: const reviewNotesLink = document.getElementById('review-notes-link');
    const fab = document.querySelector('.fab');
    const newNotePanel = document.getElementById('new-note-panel');
    const handwritingOption = document.querySelector('.option-card:nth-child(1)');
    const cameraOption = document.querySelector('.option-card:nth-child(2)');
   
    const importOption = document.querySelector('.option-card:nth-child(4)');
    const audioRecorderPage = document.getElementById('audio-recorder-page');
    const recordingOption = document.querySelector('.option-card:nth-child(3)');
    const backFromRecorder = document.getElementById('back-from-recorder');
    const saveRecordingNote = document.getElementById('save-recording-note');
    const recordControlBtn = document.getElementById('record-control-btn');
    const recordingTimer = document.getElementById('recording-timer');
    const recordingStatus = document.getElementById('recording-status');
    const audioPlayback = document.getElementById('audio-playback');

    // Sidebar links
    const knowledgeMapLink = document.getElementById('knowledge-map-link');
    const virtualClassroomLink = document.getElementById('virtual-classroom-link');
    const vcHistoryLink = document.getElementById('vc-history-link');
    const settingsLink = document.getElementById('settings-link');
    const addNewTagBtn = document.getElementById('add-new-tag-btn');


    // --- Data ---
    let allNotesData = [];
    let currentNotes = [];
    let currentPage = 1;
    const notesPerPage = 20;
    let isLoading = false;
    let isTextMode = false;
    let lastX = 0;
    let lastY = 0;

    let mediaRecorder;
    let audioChunks = [];
    let recordingStartTime;
    let timerInterval;
    let recordedAudioBlob = null;
// 在文件顶部添加收藏页面相关变量
let favoritesGrid, favoritesEmpty, favoritesPage;

// 在DOM加载完成后初始化变量
function initializeFavoritesPage() {
    favoritesPage = document.getElementById('favorites-page');
    favoritesGrid = document.getElementById('favorites-grid');
    favoritesEmpty = document.getElementById('favorites-empty');
    
    console.log('收藏页面元素检查:', {
        favoritesPage: !!favoritesPage,
        favoritesGrid: !!favoritesGrid,
        favoritesEmpty: !!favoritesEmpty
    });
}


    function initializeApp() {
        allNotesData = [
            {
                id: 1,
                title: '线性代数笔记',
                content: '这是关于线性代数核心概念的详细笔记...',
                tags: ['数学', '线性代数'],
                date: '2023-10-26',
                image: 'https://picsum.photos/150/150?random=1',
                bookmarked: true,
                source: '手写'
            },
            {
                id: 2,
                title: '物理学第一定律',
                content: '牛顿第一定律，也被称为惯性定律...',
                tags: ['物理', '经典力学'],
                date: '2023-10-25',
                image: 'https://picsum.photos/150/150?random=2',
                bookmarked: false,
                source: '导入'
            },
            {
                id: 3,
                title: '化学元素周期表',
                content: '元素周期表是根据原子序数从小至大排序的...',
                tags: ['化学', '元素'],
                date: '2023-10-24',
                image: 'https://picsum.photos/150/150?random=3',
                bookmarked: true,
                source: '拍照'
            },
            {
                id: 4,
                title: '英语语法重点',
                content: '关于现在完成时的用法总结...',
                tags: ['英语', '语法'],
                date: '2023-10-23',
                image: 'https://picsum.photos/150/150?random=4',
                bookmarked: false,
                source: '手写'
            },
            {
                id: 5,
                title: '历史事件：文艺复兴',
                content: '文艺复兴是14世纪至16世纪在欧洲...',
                tags: ['历史', '欧洲史'],
                date: '2023-10-22',
                image: 'https://picsum.photos/150/150?random=5',
                bookmarked: false,
                source: '手写'
            }
        ];
        currentNotes = allNotesData;
         currentPage = 1;
        renderNotes(); // Modified to use global variables
        initializeFavoritesPage(); // <--- 确保这一行存在
        populateSidebarTags();
        updateDashboardStats();
        setupInfiniteScroll();
        setupEventListeners();
    }
function toggleLayersPanel() {
        let layersPanel = document.getElementById('layers-panel');
        const activeNoteContent = document.querySelector('.doc-content-panel.active .note-content-container, #handwriting-page .canvas-container');

        if (!activeNoteContent) {
            console.warn("No active note content area found to attach the layers panel.");
            // Optionally, provide user feedback, e.g., a small notification
            // alert("请先打开一篇笔记再使用图层功能。");
            return;
        }

        if (layersPanel) {
            layersPanel.remove();
            return;
        }

        layersPanel = document.createElement('div');
        layersPanel.id = 'layers-panel';
        layersPanel.innerHTML = `
            <div class="layer-item">
                <div class="layer-preview">1</div>
            </div>
            <div class="layer-item">
                <div class="layer-preview">2</div>
            </div>
            <button class="add-layer-btn"><i class="fas fa-plus"></i></button>
        `;

        // Ensure the container has relative positioning
        if (getComputedStyle(activeNoteContent).position === 'static') {
            activeNoteContent.style.position = 'relative';
        }

        activeNoteContent.appendChild(layersPanel);
    }




    function populateNoteDetail(note) {
        const noteDetailPage = document.getElementById('note-detail-page');
        if (!noteDetailPage) return;

        const titleEl = noteDetailPage.querySelector('.note-detail-title-input');
        const contentEl = noteDetailPage.querySelector('.note-content-container');
        const tagsEl = noteDetailPage.querySelector('.note-detail-tags');
        const dateEl = noteDetailPage.querySelector('.note-detail-date');

        if (titleEl) titleEl.value = note.title;
        
        if (contentEl) {
            contentEl.innerHTML = ''; // Clear previous content
            if (note.source === '录音' && note.audioUrl) {
                contentEl.innerHTML = `<audio controls src="${note.audioUrl}" style="width: 100%;">Playback not supported</audio>`;
            } else if (note.image) {
                // If there's an image (like from handwriting), display it
                const img = document.createElement('img');
                img.src = note.image;
                img.style.maxWidth = '100%'; // Ensure image fits the container
                img.style.borderRadius = '8px';
                contentEl.appendChild(img);
            } else {
                // Otherwise, display the text content
                contentEl.innerHTML = note.content;
            }
        }

        if (dateEl) {
            dateEl.textContent = `Created: ${new Date(note.date).toLocaleDateString()}`;
        }

        if (tagsEl) {
            tagsEl.innerHTML = ''; // Clear existing tags
            note.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'note-tag';
                tagEl.textContent = tag;
                tagsEl.appendChild(tagEl);
            });
        }
    }

      function renderNotes() {
        notesGrid.innerHTML = '';
        const notesToRender = currentNotes.slice(0, currentPage * notesPerPage);

        if (notesToRender.length === 0) {
            notesGrid.innerHTML = '<p class="no-notes-message">没有找到匹配的笔记。</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        notesToRender.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.dataset.id = note.id;
            noteCard.dataset.title = note.title;

            const imageHtml = note.image ? `<img src="${note.image}" alt="Note Image" class="note-image">` : '';
            noteCard.innerHTML = `
                 <div class="note-menu-container">
                    <button class="note-menu-btn"><i class="fas fa-ellipsis-h"></i></button>
                    <div class="note-dropdown-menu">
                        
                        <a href="#" class="dropdown-item">分享笔记</a>
                        <a href="#" class="dropdown-item">标签管理</a>
                        <a href="#" class="dropdown-item">转化为PDF</a>
                        <a href="#" class="dropdown-item">添加到文件夹</a>
                        <a href="#" class="dropdown-item delete-note">删除笔记</a>
                    </div>
                </div>
                ${imageHtml}
                <div class="note-content">
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-excerpt">${note.content}</p>
                    <div class="note-tags">
                        ${note.tags.map((tag, index) => `<span class="tag tag-color-${(index % 5) + 1}">${tag}</span>`).join('')}
                    </div>
                    <div class="note-meta">
                        <span class="ai-status">${note.aiStatus}</span>
                        <i class="far fa-bookmark bookmark-icon ${note.bookmarked ? 'fas' : ''}"></i>
                    </div>
                </div>
            `;
            fragment.appendChild(noteCard);
        });
        notesGrid.appendChild(fragment);
    }

        function renderNotesAsList() {
        notesGrid.innerHTML = '';
        const notesToRender = currentNotes.slice(0, currentPage * notesPerPage);

        if (notesToRender.length === 0) {
            notesGrid.innerHTML = '<p class="no-notes-message">没有找到匹配的笔记。</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        notesToRender.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-list-item';
            noteItem.dataset.title = note.title;
            noteItem.innerHTML = `
                <span class="note-list-title">${note.title}</span>
            `;
            fragment.appendChild(noteItem);
        });
        notesGrid.appendChild(fragment);
    }


    // New function to update dashboard stats
    function updateDashboardStats() {
        const totalNotesEl = document.querySelector('.quick-stats .stat-item:nth-child(1) .stat-number');
        const reviewNotesEl = document.querySelector('.quick-stats .stat-item:nth-child(2) .stat-number');

        if (totalNotesEl) {
            totalNotesEl.textContent = allNotesData.length;
        }
        if (reviewNotesEl) {
            // Mock data for review count
            reviewNotesEl.textContent = allNotesData.filter(n => n.needsReview).length || 3;
        }
    }

      function showPage(pageToShow) {
        const pages = [homePage, allNotesPage, fileManagerPage, trackingPage, settingsPage, importPage, handwritingPage, capturePage, cameraPage, tutorPage, knowledgeMapPage, virtualClassroomPage, vcHistoryPage, aiCreationPage, documentViewerPage, audioRecorderPage, favoritesPage]; // <--- 在这里添加 favoritesPage
        pages.forEach(p => {
            if (p) { // Check if element exists
                p.style.display = (p === pageToShow) ? (p === homePage ? 'block' : 'flex') : 'none';
            }
        });
        if (newNotePanel) newNotePanel.classList.remove('visible');
    }

    function populateSidebarTags() {
        const allTags = [...new Set(allNotesData.flatMap(note => note.tags))];
        tagsList.innerHTML = '';
        allTags.forEach((tag, index) => {
            const li = document.createElement('li');
            li.className = `sidebar-tag tag-color-${(index % 5) + 1}`;
            li.textContent = tag;
            tagsList.appendChild(li);
        });
    }

    function setupInfiniteScroll() {
        mainContent.addEventListener('scroll', () => {
            if (isLoading || notesGrid.children.length >= currentNotes.length) return;
            if (mainContent.scrollTop + mainContent.clientHeight >= mainContent.scrollHeight - 5) {
                isLoading = true;
                currentPage++;
                const nextNotes = currentNotes.slice(0, currentPage * notesPerPage);
                setTimeout(() => {
                    renderNotes(nextNotes);
                    isLoading = false;
                }, 300);
            }
        });
    }

    function toggleTabsDropdown() {
        if (tabsDropdown.classList.contains('show')) {
            tabsDropdown.classList.remove('show');
        } else {
            populateTabsDropdown();
            tabsDropdown.classList.add('show');
        }
    }
function populateTabsDropdown() {
        tabsDropdown.innerHTML = '';
        const tabs = document.querySelectorAll('.note-tab');
        tabs.forEach(tab => {
            const tabId = tab.dataset.tabId;
            const tabName = tab.querySelector('span').textContent;
            const item = document.createElement('div');
            item.className = 'tabs-dropdown-item';
            item.textContent = tabName;
            item.dataset.tabId = tabId;
            item.addEventListener('click', () => {
                switchTab(tabId);
                tabsDropdown.classList.remove('show');
            });
            tabsDropdown.appendChild(item);
        });
    }
    function setupEventListeners() {
        if (multiSelectIcon) {
        multiSelectIcon.addEventListener('click', () => {
            multiSelectMode = !multiSelectMode;
            document.body.classList.toggle('multi-select-mode', multiSelectMode);
            const checkboxes = document.querySelectorAll('.multi-select-checkbox');
            checkboxes.forEach(cb => {
                cb.style.display = multiSelectMode ? 'block' : 'none';
            });

            if (!multiSelectMode) {
                // 退出多选模式
                const selectedCheckboxes = document.querySelectorAll('.multi-select-checkbox:checked');
                const selectedNotes = [];
                selectedCheckboxes.forEach(checkbox => {
                    const noteId = checkbox.dataset.noteId;
                    const note = getNoteById(noteId);
                    if (note) {
                        selectedNotes.push(note);
                    }
                });

                populateSelectedNotesPanel(selectedNotes);

                document.querySelectorAll('.note-card.selected').forEach(card => {
                    card.classList.remove('selected');
                    card.querySelector('.multi-select-checkbox').checked = false;
                });
                multiSelectIcon.classList.remove('active');
            } else {
                // 进入多选模式
                multiSelectIcon.classList.add('active');
            }
        });
    }
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('full-width');
            });
        }

        if (layerButton) {
            layerButton.addEventListener('click', toggleLayersPanel);
        }
       if (tabListBtn) {
            tabListBtn.addEventListener('click', toggleTabsDropdown);
        }

        if (homeIcon) {
            homeIcon.addEventListener('click', () => {
                // 重置当前页面状态
                currentPage = 1;
                currentNotes = allNotesData;
                
                // 重新渲染笔记列表
                renderNotes(currentNotes.slice(0, notesPerPage));
                
                // 重置标签选中状态
                const tagItems = tagsList.querySelectorAll('li');
                tagItems.forEach(item => item.classList.remove('active'));
                
                // 显示首页
                showPage(homePage);
            });
        }

        
        if (libraryIcon) {
            libraryIcon.addEventListener('click', () => {
                showPage(documentViewerPage);
            });
        }

        notesGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.note-card');
            if (!card) return;

            // 1. Handle menu button click to toggle dropdown
            if (event.target.closest('.note-menu-btn')) {
                event.stopPropagation(); // Prevent card click from firing
                const menu = card.querySelector('.note-dropdown-menu');
                if (menu) {
                    // Close other open menus before toggling the current one
                    document.querySelectorAll('.note-dropdown-menu.show').forEach(m => {
                        if (m !== menu) m.classList.remove('show');
                    });
                    menu.classList.toggle('show');
                }
                return; // Stop further execution
            }

            // 2. Handle dropdown item click
            const menuItem = event.target.closest('.dropdown-item');
            if (menuItem) {
                event.stopPropagation(); // Prevent card click
                const noteId = parseInt(card.dataset.id, 10);
                const note = allNotesData.find(n => n.id === noteId);

                if (menuItem.classList.contains('delete-note')) {
                    if (confirm(`确定要删除笔记 "${note.title}" 吗？`)) {
                        allNotesData = allNotesData.filter(n => n.id !== noteId);
                        currentNotes = currentNotes.filter(n => n.id !== noteId);
                        renderNotes(currentNotes.slice(0, currentPage * notesPerPage));
                        populateSidebarTags();
                        updateDashboardStats();
                    }
                } else {
                    alert(`功能 "${menuItem.textContent}" 待开发`);
                }
                
                // Hide the menu after an item is clicked
                menuItem.closest('.note-dropdown-menu').classList.remove('show');
                return; // Stop further execution
            }

            // 3. Handle bookmark click
            if (event.target.classList.contains('bookmark-icon')) {
                event.target.classList.toggle('fas');
                event.target.classList.toggle('far');
                const noteId = parseInt(card.dataset.id, 10);
                const note = allNotesData.find(n => n.id === noteId);
                if (note) {
                    note.bookmarked = !note.bookmarked;
                }
                return; // Stop further execution
            }

            // 4. If no specific element was clicked, it's a click on the card itself
            const noteId = parseInt(card.dataset.id, 10);
            const noteData = allNotesData.find(n => n.id === noteId);

            if (noteData) {
                if (noteData.source === '手写') {
                    loadNoteIntoHandwritingEditor(noteData);
                    showPage(handwritingPage);
                } else {
                    populateNoteDetail(noteData);
                    showPage(noteDetailPage);
                }
            } else {
                console.error('Note data not found for id:', noteId);
            }
        });

        /* REMOVED a bunch of event listeners for old dashboard items */

        // --- New Event Listeners for Sidebar ---
        if (allFilesLink) {
            allFilesLink.addEventListener('click', (e) => {
                e.preventDefault();
                // For now, just show the file manager page if it exists
                if (fileManagerPage) {
                    showPage(fileManagerPage);
                } else {
                    alert('“所有文件”页面待开发');
                }
            });
        }

                if (favoritesLink) {
            favoritesLink.addEventListener('click', (e) => {
                e.preventDefault();
                showFavoritesPage();
            });
        }

        // 添加显示收藏页面的函数
function showFavoritesPage() {
    // 确保元素已初始化
    if (!favoritesPage || !favoritesGrid || !favoritesEmpty) {
        initializeFavoritesPage();
    }
    
    // 验证数据
    console.log('笔记收藏状态:', allNotesData.map(note => ({
        id: note.id, 
        title: note.title, 
        bookmarked: note.bookmarked
    })));
    
    const bookmarkedNotes = allNotesData.filter(note => note.bookmarked === true);
    console.log('收藏笔记数量:', bookmarkedNotes.length);
    
    if (bookmarkedNotes.length === 0) {
        favoritesGrid.style.display = 'none';
        favoritesEmpty.style.display = 'flex';
    } else {
        favoritesGrid.style.display = 'grid';
        favoritesEmpty.style.display = 'none';
        
        favoritesGrid.innerHTML = '';
        bookmarkedNotes.forEach(note => {
            const noteCard = createNoteCard(note);
            favoritesGrid.appendChild(noteCard);
        });
    }
    
    showPage(favoritesPage);
}

        // 添加返回按钮事件
        const favoritesBackLink = document.getElementById('favorites-back-link');
        const favoritesMainBack = document.getElementById('favorites-main-back');
        
        if (favoritesBackLink) {
            favoritesBackLink.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(homePage);
            });
        }
        
        if (favoritesMainBack) {
            favoritesMainBack.addEventListener('click', () => {
                showPage(homePage);
            });
        }

        // 添加收藏页面的视图切换
        const favoritesGridBtn = document.getElementById('favorites-grid-btn');
        const favoritesListBtn = document.getElementById('favorites-list-btn');
        
       // 修复收藏页面的视图切换事件
if (favoritesGridBtn && favoritesListBtn) {
    favoritesGridBtn.addEventListener('click', () => {
        if (favoritesGrid) {
            favoritesGrid.className = 'notes-grid';
            favoritesGridBtn.classList.add('active');
            favoritesListBtn.classList.remove('active');
            showFavoritesPage(); // 重新渲染
        }
    });

    favoritesListBtn.addEventListener('click', () => {
        if (favoritesGrid) {
            favoritesGrid.className = 'notes-grid list-view';
            favoritesListBtn.classList.add('active');
            favoritesGridBtn.classList.remove('active');
            showFavoritesPage(); // 重新渲染
        }
    });
}
        function createNoteCard(note) {
            const noteCard = document.createElement('div');
             noteCard.className = 'note-card';
    noteCard.dataset.noteId = note.id;

    const isBookmarked = note.bookmarked ? 'fas' : 'far';

    noteCard.innerHTML = `
        <div class="note-card-header">
            <h3 class="note-title">${note.title}</h3>
            <i class="${isBookmarked} fa-bookmark bookmark-icon" data-note-id="${note.id}"></i>
        </div>
        <p class="note-content-preview">${note.content.substring(0, 100)}...</p>
        <div class="note-tags">
            ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p class="note-date">创建于: ${note.createdAt}</p>
        <input type="checkbox" class="multi-select-checkbox" data-note-id="${note.id}" style="display: none;">
    `;

    const checkbox = noteCard.querySelector('.multi-select-checkbox');

    noteCard.addEventListener('click', (event) => {
        if (multiSelectMode) {
            // 阻止进入笔记详情页
            event.preventDefault();
            event.stopPropagation();
            checkbox.checked = !checkbox.checked;
            noteCard.classList.toggle('selected', checkbox.checked);
        } else {
            populateNoteDetail(note);
            showPage(noteDetailPage);
        }
    });

    return noteCard;
}
        if (trashLink) {
            trashLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert('“回收站”页面待开发');
            });
        }

        // --- Existing Event Listeners ---
        if (knowledgeMapLink) {
            knowledgeMapLink.addEventListener('click', () => showPage(knowledgeMapPage));
        }

        if (virtualClassroomLink) {
            virtualClassroomLink.addEventListener('click', () => showPage(virtualClassroomPage));
        }

        if (vcHistoryLink) {
            vcHistoryLink.addEventListener('click', () => showPage(vcHistoryPage));
        }
 if (settingsLink) {
            settingsLink.addEventListener('click', () => showPage(settingsPage));
        }

        const editTagsBtn = document.getElementById('edit-tags-btn');
        let isEditingTags = false;

        if (editTagsBtn) {
            editTagsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isEditingTags = !isEditingTags;
                toggleTagsEditing(isEditingTags);
            });
        }

        function toggleTagsEditing(isEditing) {
            const tagItems = tagsList.querySelectorAll('li');
            if (isEditing) {
                editTagsBtn.textContent = '完成';
                tagsList.classList.add('editable');
                tagItems.forEach(item => {
                    item.classList.add('editing');
                    const tagNameSpan = item.querySelector('span');
                    if (tagNameSpan) {
                        tagNameSpan.contentEditable = true;
                    }
                    item.dataset.originalName = item.textContent;

                    // Add click listener to focus on the span
                    item.addEventListener('click', focusOnTagSpan, { once: false });
                });
            } else {
                editTagsBtn.textContent = '编辑标签';
                tagsList.classList.remove('editable');
                tagItems.forEach(item => {
                    item.classList.remove('editing');
                    const tagNameSpan = item.querySelector('span');
                    if (tagNameSpan) {
                        tagNameSpan.contentEditable = false;
                    }
                    // Remove the click listener
                    item.removeEventListener('click', focusOnTagSpan);
                    // Here you might want to save the changes
                });
            }
        }

        function focusOnTagSpan(event) {
            event.stopPropagation();
            const span = event.currentTarget.querySelector('span');
            if (span && document.activeElement !== span) {
                span.focus();
                // Select all text in the span
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(span);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        if (tagsList) {
            // Double-click to make a tag editable
            tagsList.addEventListener('dblclick', (e) => {
                const tagItem = e.target.closest('li.sidebar-tag');
                if (!tagItem) return;

                // Only allow editing if the main '编辑标签' button is active
                if (isEditingTags) {
                    tagItem.setAttribute('contenteditable', 'true');
                    tagItem.focus();
                }
            });

            // Handle single clicks for filtering or deletion
            tagsList.addEventListener('click', (e) => {
            const tagItem = e.target.closest('li.sidebar-tag');
            if (!tagItem) return;

            if (isEditingTags) {
                // ... existing deletion logic ...
            } else {
                // Handle filtering
                const wasActive = tagItem.classList.contains('active');
                tagsList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
                
                if (wasActive) {
                    currentNotes = allNotesData; // Show all notes
                } else {
                    tagItem.classList.add('active');
                    const selectedTag = tagItem.textContent;
                    currentNotes = allNotesData.filter(note => note.tags.includes(selectedTag));
                }
                
                currentPage = 1; // Reset pagination
                if (notesGrid.className.includes('list-view')) {
                    renderNotesAsList(); // Use modified function
                } else {
                    renderNotes(); // Use modified function
                }
            }
        });

function getNoteById(id) {
    return allNotesData.find(note => note.id.toString() === id.toString());
}

function populateSelectedNotesPanel(notes) {
    const panel = document.querySelector('.selected-notes-panel');
    if (!panel) return;

    panel.innerHTML = '<h4>已选笔记</h4>';
    const list = document.createElement('ul');
    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.textContent = note.title;
        list.appendChild(listItem);
    });
    panel.appendChild(list);
}
            // Save on blur
            tagsList.addEventListener('blur', (e) => {
                const tagItem = e.target.closest('li.sidebar-tag');
                if (tagItem && tagItem.getAttribute('contenteditable') === 'true') {
                    tagItem.setAttribute('contenteditable', 'false');
                    const oldName = tagItem.dataset.originalName;
                    const newName = tagItem.textContent.trim();
                    if (oldName !== newName) {
                        updateTagName(oldName, newName);
                    }
                }
            }, true);

            // Save on Enter key
            tagsList.addEventListener('keydown', (e) => {
                const tagItem = e.target.closest('li.sidebar-tag');
                if (tagItem && e.key === 'Enter' && tagItem.getAttribute('contenteditable') === 'true') {
                    e.preventDefault();
                    tagItem.blur();
                }
            });
        }

        function updateTagName(oldName, newName) {
            if (!newName || oldName === newName) return;

            console.log(`Renaming tag from "${oldName}" to "${newName}"`);

            allNotesData.forEach(note => {
                const tagIndex = note.tags.indexOf(oldName);
                if (tagIndex > -1) {
                    note.tags[tagIndex] = newName;
                }
            });

            // Re-populate sidebar tags first
            const activeTagElement = document.querySelector(`.sidebar-tag.active`);
            const wasActive = activeTagElement && activeTagElement.dataset.originalName === oldName;
            
            populateSidebarTags();

            // Re-apply active state if the renamed tag was active
            if (wasActive) {
                const newTagEl = Array.from(tagsList.querySelectorAll('li')).find(el => el.textContent === newName);
                if (newTagEl) {
                    newTagEl.classList.add('active');
                    // Re-filter notes with the new tag name
                    currentNotes = allNotesData.filter(note => note.tags.includes(newName));
                } else {
                     // Should not happen if populate is correct
                    currentNotes = allNotesData;
                }
            } else {
                 // If no tag was active, or a different one was, just refresh with all notes
                 currentNotes = allNotesData;
            }
            
            currentPage = 1;
            renderNotes(currentNotes.slice(0, notesPerPage)); 
            toggleTagsEditing(true); // Remain in edit mode
        }


        // AI Creation Page Tabs
        const aiTabs = document.querySelector('.ai-panel-tabs');
        if (aiTabs) {
            const tabButtons = aiTabs.querySelectorAll('.ai-tab-btn');
            const tabContents = document.querySelectorAll('.ai-tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    tabContents.forEach(content => {
                        if (content.id === `${button.dataset.tab}-tab-content`) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                });
            });
        }

        if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            notesGrid.className = 'notes-grid';
            renderNotes(); // Modified to use global variables
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', () => {
            notesGrid.className = 'notes-grid list-view';
            renderNotesAsList(); // Modified to use global variables
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

        if (addNewTagBtn) {
            addNewTagBtn.addEventListener('click', () => {
                const newTagName = prompt('请输入新的标签名称：');
                if (newTagName && newTagName.trim() !== '') {
                    const newTag = {
                        id: `tag-${Date.now()}`,
                        name: newTagName.trim(),
                        color: '#ccc' // Default color
                    };

                    if (!allNotesData.some(note => note.tags.includes(newTag.name))) {
                        // 将新标签添加到所有笔记的标签集合中
                        allNotesData.forEach(note => {
                            if (!note.tags.includes(newTag.name)) {
                                note.tags.push(newTag.name);
                            }
                        });
                        populateSidebarTags(); // 重新渲染侧边栏标签
                        console.log('新标签已添加:', newTag);
                    } else {
                        alert('该标签已存在！');
                    }
                }
            });
        }

        if (fab) {
            fab.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling to body
                if (newNotePanel) {
                    newNotePanel.classList.toggle('visible');
                }
            });
        }

        if (handwritingOption) {
            handwritingOption.addEventListener('click', () => showPage(handwritingPage));
        }

        if (cameraOption) {
            cameraOption.addEventListener('click', () => showPage(cameraPage));
        }

        if (recordingOption) {
            recordingOption.addEventListener('click', () => {
                resetRecorder();
                showPage(audioRecorderPage);
            });
        }

        if (importOption) {
            importOption.addEventListener('click', () => showPage(importPage));
        }

        if (backFromRecorder) {
            backFromRecorder.addEventListener('click', () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                showPage(mainPage);
            });
        }

        if (recordControlBtn) {
            recordControlBtn.addEventListener('click', toggleRecording);
        }

        if (saveRecordingNote) {
            saveRecordingNote.addEventListener('click', saveRecordingAsNote);
        }

        document.body.addEventListener('click', (e) => {
            // Hide panel if clicking outside
            if (newNotePanel && newNotePanel.classList.contains('visible') && !e.target.closest('.bottom-panel') && !e.target.closest('.fab')) {
                newNotePanel.classList.remove('visible');
            }

            // 如果正在编辑标签，并且点击的不是标签列表区域或编辑按钮，则完成编辑
            if (isEditingTags && !e.target.closest('.sidebar-tags-section')) {
                isEditingTags = false;
                toggleTagsEditing(false);
            }

            // Hide note dropdown menus if clicking outside
            if (!e.target.closest('.note-menu-container')) {
                document.querySelectorAll('.note-dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
            }

            // Check for back button clicks more reliably
            const backButton = e.target.closest('[class*="back-btn"]');
            if (backButton) {
                 e.preventDefault();
                 // Check if we are on the handwriting page
                if (handwritingPage && handwritingPage.style.display !== 'none') {
                    saveHandwritingAsNote();
                } 
                 showPage(homePage);
                 currentEditingNoteId = null; // --- ADDITION: Reset editing state when leaving page
            }
        });

        if (aiCreationCta) { 
            aiCreationCta.addEventListener('click', () => {
                showPage(aiCreationPage);
            });
        }

        if (toggleSelectionPanelBtn) { // New
            toggleSelectionPanelBtn.addEventListener('click', () => {
                if (selectedNotesPanel) {
                    selectedNotesPanel.classList.toggle('collapsed');
                }
            });
        }

        if (multiSelectIcon) {
            multiSelectIcon.addEventListener('click', () => {
                multiSelectMode = !multiSelectMode;
                document.body.classList.toggle('multi-select-mode', multiSelectMode);

                if (!multiSelectMode) {
                    const selectedCheckboxes = document.querySelectorAll('.multi-select-checkbox:checked');
                    const selectedNotes = [];
                    selectedCheckboxes.forEach(checkbox => {
                        const noteId = checkbox.dataset.noteId;
                        const note = allNotesData.find(n => n.id.toString() === noteId.toString());
                        if (note) {
                            selectedNotes.push(note);
                        }
                    });
                    populateSelectedNotesPanel(selectedNotes);
                    document.querySelectorAll('.note-card.selected').forEach(card => {
                        card.classList.remove('selected');
                        card.querySelector('.multi-select-checkbox').checked = false;
                    });
                } else {
                    multiSelectIcon.classList.add('active');
                }
            });
        }

        searchIconOnly.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up to the document
            searchContainer.classList.add('active');
            searchInput.focus();
            // Move the multi-select icon to the left
            multiSelectIcon.style.transform = 'translateX(0px)'; 
        });

        // Close search bar when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchContainer.classList.remove('active');
                searchInput.value = '';
                multiSelectIcon.style.transform = 'translateX(0)';
                // Optionally, re-render all notes when search is cleared
                renderNotes(allNotesData.slice(0, notesPerPage));
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterAndDisplayNotes(searchTerm);
        });
    }

    function filterAndDisplayNotes(searchTerm) {
        if (!searchTerm) {
            currentNotes = allNotesData;
            renderNotes(currentNotes.slice(0, notesPerPage));
            return;
        }
        const filteredNotes = allNotesData.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            (note.content && note.content.toLowerCase().includes(searchTerm))
        );
        currentNotes = filteredNotes;
        renderNotes(currentNotes.slice(0, notesPerPage));
        // No need to switch pages, filtering happens on the current view.
    }

    // --- NEW FUNCTION to load existing note into handwriting editor ---
    let currentEditingNoteId = null; // Variable to track the note being edited

    function loadNoteIntoHandwritingEditor(note) {
        if (!handwritingCanvas || !note || !note.image) return;
        
        currentEditingNoteId = note.id; // Set the current note ID

        const ctx = handwritingCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, handwritingCanvas.width, handwritingCanvas.height);
            drawGrid(); // Redraw grid if you want it behind the image
            ctx.drawImage(img, 0, 0);
        };
        img.src = note.image;
    }

    function saveHandwritingAsNote() {
        if (!handwritingCanvas) return;

        const imageDataUrl = handwritingCanvas.toDataURL('image/png');

        // --- MODIFICATION START ---
        if (currentEditingNoteId !== null) {
            // Update existing note
            const noteToUpdate = allNotesData.find(n => n.id === currentEditingNoteId);
            if (noteToUpdate) {
                noteToUpdate.image = imageDataUrl;
                noteToUpdate.date = new Date().toISOString().split('T')[0]; // Update date
                console.log('Note updated:', currentEditingNoteId);
            }
        } else {
            // Create new note
            const pageNumber = allNotesData.length + 1; // 获取当前笔记总数作为页码
            const newNote = {
                id: Date.now(), // Use timestamp for a unique ID
                title: `手写笔记 page${pageNumber}`,
                content: '', // Handwriting notes don't have text content
                tags: ['手写', '新笔记'],
                date: new Date().toISOString().split('T')[0],
                image: imageDataUrl,
                bookmarked: false,
                source: '手写'
            };
            allNotesData.unshift(newNote); // Add to the beginning of the array
        }
        // --- MODIFICATION END ---

        currentNotes = allNotesData;
        renderNotes(currentNotes.slice(0, notesPerPage)); // Re-render notes
        populateSidebarTags();
        updateDashboardStats();
    }

function resetRecorder() {
    audioChunks = [];
    recordedAudioBlob = null;
    if(audioPlayback) {
        audioPlayback.src = '';
        audioPlayback.style.display = 'none';
    }
    if(recordControlBtn) {
        recordControlBtn.classList.remove('recording');
        recordControlBtn.disabled = false;
    }
    if(recordingStatus) {
        recordingStatus.textContent = '点击按钮开始录音';
    }
    stopTimer();
    if(recordingTimer) {
        recordingTimer.textContent = '00:00';
    }
}

async function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordControlBtn.classList.remove('recording');
        recordingStatus.textContent = '录音完成，点击播放';
        recordControlBtn.disabled = true; // Disable until processing is done
        stopTimer();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                recordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(recordedAudioBlob);
                audioPlayback.src = audioUrl;
                audioPlayback.style.display = 'block';
                recordControlBtn.disabled = false;
                // Clean up stream tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            audioChunks = [];
            mediaRecorder.start();
            startTimer();
            recordControlBtn.classList.add('recording');
            recordingStatus.textContent = '录音中...';

        } catch (err) {
            console.error('Error accessing microphone:', err);
            recordingStatus.textContent = '无法访问麦克风';
            alert('无法访问麦克风。请检查您的浏览器权限。');
        }
    }
}

function startTimer() {
    recordingStartTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - recordingStartTime;
        recordingTimer.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function saveRecordingAsNote() {
    if (!recordedAudioBlob) {
        alert('没有可保存的录音。');
        return;
    }

    const audioUrl = URL.createObjectURL(recordedAudioBlob);

    const newNote = {
        id: Date.now(),
        title: `录音笔记 ${new Date().toLocaleString()}`,
        content: '',
        audioUrl: audioUrl, // Store the blob URL
        tags: ['录音'],
        date: new Date().toISOString(),
        source: '录音',
    };

    allNotesData.unshift(newNote);
    currentNotes = allNotesData;
    renderNotes(currentNotes.slice(0, notesPerPage));
    updateDashboardStats();
    showPage(homePage);
    alert('录音笔记已保存！');
}

    // --- Handwriting Page Logic ---
    const noteTabsContainer = document.querySelector('.note-tabs');
    const addTabBtn = document.querySelector('.add-tab-btn');
    const handwritingToolbar = document.querySelector('.handwriting-toolbar');
    const handwritingCanvas = document.getElementById('handwriting-canvas');
    const textInputContainer = document.getElementById('text-input-container'); // 新增
    const textTool = document.querySelector('.toolbar-button[title="文字输入"]'); // 新增

    if (noteTabsContainer && handwritingCanvas && handwritingToolbar) {
        ctx = handwritingCanvas.getContext('2d');
        isCanvasReady = true; // Set the flag when canvas is ready
        let drawing = false;
        let textMode = false; // 新增：文本模式状态
        let activeTabId = null;
        let noteData = {}; // Object to store canvas data for each tab

        // --- Canvas and Drawing State ---
        let penState = {
            color: '#000000',
            width: 2,
            mode: 'pen' // 'pen' or 'eraser'
        };

        // --- Functions ---

        function resizeCanvas() {
            const container = handwritingCanvas.parentElement.parentElement;
            handwritingCanvas.width = container.clientWidth;
            handwritingCanvas.height = container.clientHeight;
            loadCanvasState(activeTabId); // Reload canvas state after resize
        }

        function drawGrid() {
            const gridSize = 20;
            ctx.strokeStyle = '#eef0f2';
            ctx.lineWidth = 1;
            for (let x = 0; x < handwritingCanvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, handwritingCanvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < handwritingCanvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(handwritingCanvas.width, y);
                ctx.stroke();
            }
        }

        function saveCanvasState(tabId) {
            if (!tabId) return;
            noteData[tabId] = handwritingCanvas.toDataURL();
            console.log(`Saved state for ${tabId}`);
        }

        function loadCanvasState(tabId) {
            ctx.clearRect(0, 0, handwritingCanvas.width, handwritingCanvas.height);
            drawGrid();
            if (noteData[tabId]) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                };
                img.src = noteData[tabId];
                console.log(`Loaded state for ${tabId}`);
            } else {
                  console.log(`No state found for ${tabId}, starting fresh.`);
            }
        }

        function switchTab(tabId) {
        if (activeTabId === tabId) return;

        // Remove existing layers panel before switching
        const layersPanel = document.getElementById('layers-panel');
        if (layersPanel) {
            layersPanel.remove();
        }

        saveCanvasState(activeTabId);

            activeTabId = tabId;

            // Update active class on tabs
            const allTabs = noteTabsContainer.querySelectorAll('.note-tab');
            allTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tabId === tabId);
            });

            // Load new state
            loadCanvasState(activeTabId);
        }

        let newNoteCounter = 1;

        function createNewTab() {
            const newTabId = `note-${Date.now()}`;
            const newTab = document.createElement('div');
            newTab.classList.add('note-tab');
            newTab.dataset.tabId = newTabId;
            newTab.innerHTML = `
                <span contenteditable="true">页 ${newNoteCounter}</span>
                <button class="close-tab-btn">&times;</button>
            `;
            noteTabsContainer.appendChild(newTab);
            switchTab(newTabId);
            newNoteCounter++;
        }

        // --- Event Listeners ---

        if (addTabBtn) {
            addTabBtn.addEventListener('click', createNewTab);
        }

        // Drawing events
        handwritingCanvas.addEventListener('mousedown', (e) => {
            if (textMode) return; // 在文本模式下禁用绘图
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = penState.color;
            ctx.lineWidth = penState.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        });

        handwritingCanvas.addEventListener('mousemove', (e) => {
            if (drawing) {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
        });

        handwritingCanvas.addEventListener('mouseup', () => { drawing = false; ctx.closePath(); });
        handwritingCanvas.addEventListener('mouseleave', () => { drawing = false; });

        // Tab management
        noteTabsContainer.addEventListener('click', (e) => {
            const targetTab = e.target.closest('.note-tab');
            if (!targetTab) return;

            if (e.target.classList.contains('close-tab-btn')) {
                e.stopPropagation(); // Prevent tab switch when closing
                const tabIdToClose = targetTab.dataset.tabId;
                delete noteData[tabIdToClose]; // Remove saved data
                targetTab.remove();
                
                if (activeTabId === tabIdToClose) {
                    const firstRemainingTab = noteTabsContainer.querySelector('.note-tab');
                    if (firstRemainingTab) {
                        switchTab(firstRemainingTab.dataset.tabId);
                    } else {
                        activeTabId = null;
                        ctx.clearRect(0, 0, handwritingCanvas.width, handwritingCanvas.height);
                        drawGrid();
                    }
                }
                return;
            }

            switchTab(targetTab.dataset.tabId);
        });

        // 新增：处理画布上的文本输入
        if (textInputContainer) {
            textInputContainer.addEventListener('click', (e) => {
                if (!textMode) return;

                // 如果点击的是已有的文本框，则不创建新的
                if (e.target.classList.contains('editable-text')) {
                    e.target.focus();
                    return;
                }

                createEditableTextBox(e.clientX, e.clientY);
            });
        }

        function createEditableTextBox(x, y) {
            const textBox = document.createElement('div');
            textBox.contentEditable = 'true';
            textBox.className = 'editable-text';
            
            // 将屏幕坐标转换为相对于容器的坐标
            const containerRect = textInputContainer.getBoundingClientRect();
            textBox.style.left = `${x - containerRect.left}px`;
            textBox.style.top = `${y - containerRect.top}px`;

            textInputContainer.appendChild(textBox);
            textBox.focus();

            textBox.addEventListener('blur', () => {
                if (textBox.textContent.trim() === '') {
                    textInputContainer.removeChild(textBox);
                }
                // 可选：失去焦点后设为不可编辑，需要再次点击才能编辑
                // textBox.contentEditable = 'false'; 
            });
        }

        // Toolbar interaction
        handwritingToolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-button');
            if (!button) return;

            // Example: Toggle active state on a button
            // More complex logic is needed for brush palettes, etc.
            const isActive = button.classList.toggle('active');

            // Simple example for a tool
            if (button.title === '笔刷' && isActive) {
                console.log('Brush tool selected');
                textMode = false; // 切换到笔刷时关闭文本模式
                handwritingCanvas.style.cursor = 'crosshair';
                if(textTool) textTool.classList.remove('active');
                // Here you would open a brush selection palette
            } else if (button.title === '文字输入') {
                textMode = isActive;
                console.log('Text tool selected:', textMode);
                handwritingCanvas.style.cursor = textMode ? 'text' : 'crosshair';
                if (isActive) {
                    // 取消其他工具的激活状态
                    handwritingToolbar.querySelectorAll('.toolbar-button.active').forEach(b => {
                        if (b !== button) b.classList.remove('active');
                    });
                }
            }
        });

        // --- Initialization ---
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();


   

        const handwritingPageObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === 'style' && handwritingPage.style.display !== 'none') {
                    resizeCanvas();
                }
            }
        });

        if(handwritingPage) {
            handwritingPageObserver.observe(handwritingPage, { attributes: true });
        }

        // Initial setup for the first tab
        const initialTab = document.querySelector('.note-tab');
        if (initialTab) {
            switchTab(initialTab.dataset.tabId);
        }
    }

    // --- End of Handwriting Page Logic ---

    initializeApp();
});


// --- AI Creation Page: Selection Search and Filter --- //
const selectionSearchInput = document.getElementById('selection-search-input');
const selectionTagsContainer = document.querySelector('.selection-tags-container');
const selectedNotesList = document.querySelector('.selected-notes-list');

// Mock function to populate selected items - replace with your actual data logic
function populateAISelectedItems() {
    // This is where you would get your actual selected notes data
    const selectedItems = getSelectedNotesData(); // Assume this function returns your selected notes

    selectedNotesList.innerHTML = ''; // Clear current list
    const allTags = new Set();

    selectedItems.forEach(item => {
        const li = document.createElement('li');
        // Assuming item has properties like 'icon', 'title', and 'tags' (an array)
        li.innerHTML = `<i class="fas ${item.icon}"></i> ${item.title}`;
        li.dataset.tags = item.tags.join(',');
        li.dataset.id = item.id;
        selectedNotesList.appendChild(li);
        item.tags.forEach(tag => allTags.add(tag));
    });

    populateSelectionTags(allTags);
}

function populateSelectionTags(tags) {
    selectionTagsContainer.innerHTML = '<span class="selection-tag active">全部</span>';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'selection-tag';
        span.textContent = tag;
        selectionTagsContainer.appendChild(span);
    });
}

function filterSelectedItems() {
    if (!selectionSearchInput || !selectionTagsContainer || !selectedNotesList) return;

    const searchTerm = selectionSearchInput.value.toLowerCase();
    const activeTag = selectionTagsContainer.querySelector('.active').textContent;
    const items = selectedNotesList.querySelectorAll('li');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const tags = item.dataset.tags ? item.dataset.tags.split(',') : [];

        const textMatch = text.includes(searchTerm);
        const tagMatch = activeTag === '全部' || tags.includes(activeTag);

        if (textMatch && tagMatch) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

if (selectionSearchInput) {
    selectionSearchInput.addEventListener('input', filterSelectedItems);
}

if (selectionTagsContainer) {
    selectionTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('selection-tag')) {
            const currentActive = selectionTagsContainer.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            e.target.classList.add('active');
            filterSelectedItems();
        }
    });
}

// Example of how you might integrate this when showing the AI page
function showAiCreationPage() {
    // ... your existing code to show the page ...
    populateAISelectedItems(); // Populate items and tags
    filterSelectedItems(); // Apply initial filter
    showPage('ai-creation-page');
}

// You'll need a function to get your selected notes data
function getSelectedNotesData() {
    // This is a MOCK function. Replace with your actual logic.
    // It should return an array of objects, where each object is a selected note.
    return notes.filter(note => note.selected).map(note => ({
        id: note.id,
        title: note.title,
        icon: 'fa-file-alt', // Or determine icon based on note type
        tags: note.tags || []
    }));
}

// Make sure to call showAiCreationPage() when the user navigates to the AI space.
// For example, in the event listener for the dashboard item:
// reviewNotesLink.addEventListener('click', () => showAiCreationPage());

// --- Handwriting Page Logic ---

function initializeHandwritingPage() {
    const handwritingPage = document.getElementById('handwriting-page');
    if (!handwritingPage) return; // Only run if the page exists

    const brushTool = document.getElementById('brush-tool');
    const brushPanel = document.getElementById('brush-panel');
    const canvas = document.getElementById('handwriting-canvas');
    const ctx = canvas.getContext('2d');

    const brushState = {
        type: 'pen',
        size: 6,
        color: '#000000',
        opacity: 1,
        isDrawing: false,
        lastX: 0,
        lastY: 0
    };

    // --- Panel Logic ---
    function setupBrushPanel() {
        if (!brushTool || !brushPanel) return;

        brushTool.addEventListener('click', (e) => {
            e.stopPropagation();
            brushPanel.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!brushPanel.contains(e.target) && !brushTool.contains(e.target)) {
                brushPanel.classList.remove('show');
            }
        });

        // Event delegation for panel controls
        brushPanel.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            // Handle brush type selection
            if (target.classList.contains('brush-type')) {
                brushPanel.querySelectorAll('.brush-type').forEach(t => t.classList.remove('active'));
                target.classList.add('active');
                brushState.type = target.dataset.type;
                updateBrushStyle();
            }

            // Handle stroke size selection
            if (target.classList.contains('stroke-size')) {
                brushPanel.querySelectorAll('.stroke-size').forEach(s => s.classList.remove('active'));
                target.classList.add('active');
                brushState.size = parseInt(target.dataset.size);
                updateBrushStyle();
            }

            // Handle color selection
            if (target.classList.contains('color-option')) {
                brushPanel.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
                target.classList.add('active');
                brushState.color = target.dataset.color;
                updateBrushStyle();
            }
        });

        // Opacity slider
        const opacitySlider = brushPanel.querySelector('.opacity-slider');
        const opacityValue = brushPanel.querySelector('.opacity-value');
        if (opacitySlider && opacityValue) {
            opacitySlider.addEventListener('input', () => {
                brushState.opacity = parseInt(opacitySlider.value) / 100;
                opacityValue.textContent = `${opacitySlider.value}%`;
                updateBrushStyle();
            });
        }
    }

    // --- Canvas & Drawing Logic ---
    function setupCanvas() {
        const container = canvas.parentElement;

        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            drawGrid(); // Redraw grid on resize
            updateBrushStyle();
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // --- Image insertion --- 
        const insertImageBtn = document.getElementById('insert-image-btn');
        if (insertImageBtn) {
            insertImageBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = readerEvent => {
                        createImageContainer(canvas, readerEvent.target.result);
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            });
        }


    
function createImageContainer(canvasElement, src) {
        const container = document.createElement('div');
        container.className = 'image-container';

        const img = new Image();
        img.src = src;
        img.className = 'resizable-image';
        container.appendChild(img);

        canvasElement.parentElement.appendChild(container);

        img.onload = () => {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const width = 600;
            const height = width * aspectRatio;
            container.style.width = `${width}px`;
            container.style.height = `${height}px`;
            // Center the container
            container.style.left = `${(canvasElement.width - width) / 2}px`;
            container.style.top = `${(canvasElement.height - height) / 2}px`;
        };

        // Add drag functionality
        let isDragging = false;
        let offsetX, offsetY;
        container.addEventListener('mousedown', (e) => {
            // Only drag if the target is the container itself, not the resize handles
            if (e.target === container || e.target === img) {
                isDragging = true;
                offsetX = e.clientX - container.offsetLeft;
                offsetY = e.clientY - container.offsetTop;
                container.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
            }
        });

        // Add a button or event to bake the image onto the canvas
        const bakeButton = document.createElement('button');
        bakeButton.innerText = 'OK';
        bakeButton.className = 'bake-image-btn';
        container.appendChild(bakeButton);

         bakeButton.addEventListener('click', () => {
        const dpr = window.devicePixelRatio || 1;
        const mainCtx = canvasElement.getContext('2d');
        const mainCanvasRect = canvasElement.getBoundingClientRect();

        const containerRect = container.getBoundingClientRect();
        const targetWidth = containerRect.width;
        const targetHeight = containerRect.height;

        // Create an off-screen canvas with the exact physical pixel dimensions
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = targetWidth * dpr;
        offscreenCanvas.height = targetHeight * dpr;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.imageSmoothingQuality = 'high';

        // Perform the single, high-quality scaling operation
        offscreenCtx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // Calculate the drawing position on the main canvas (in CSS pixels)
        const x = containerRect.left - mainCanvasRect.left;
        const y = containerRect.top - mainCanvasRect.top;

        // Draw the pre-scaled, high-quality image from the off-screen canvas
        // to the main canvas. The main context's scale will handle the rest.
        mainCtx.drawImage(offscreenCanvas, x, y, targetWidth, targetHeight);

        saveCanvasState(activeTabId);
        container.remove();
    });
}

        // Drawing event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch support
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e.touches[0]); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });
        canvas.addEventListener('touchend', stopDrawing);
    }



    function initializeNewCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    return ctx;
}


    function startDrawing(e) {
        brushState.isDrawing = true;
        const pos = getPosition(e);
        [brushState.lastX, brushState.lastY] = [pos.x, pos.y];
    }

    function draw(e) {
        if (!brushState.isDrawing) return;
        const pos = getPosition(e);

        ctx.beginPath();
        ctx.moveTo(brushState.lastX, brushState.lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        [brushState.lastX, brushState.lastY] = [pos.x, pos.y];
    }

    function stopDrawing() {
        brushState.isDrawing = false;
        ctx.beginPath(); // Reset the path
    }

    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function updateBrushStyle() {
        ctx.strokeStyle = brushState.color;
        ctx.lineWidth = brushState.size;
        ctx.globalAlpha = brushState.opacity;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        if (brushState.type === 'marker') {
            ctx.globalAlpha = 0.3 * brushState.opacity;
            ctx.lineCap = 'square';
        } else if (brushState.type === 'pencil') {
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
        }
    }

    function drawGrid() {
        const gridSize = 20;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;

        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
        updateBrushStyle(); // Re-apply brush style after clearing
    }

    // --- Initialization ---
    setupBrushPanel();
    setupCanvas();

    // --- Text Input Logic ---
    const textTool = handwritingPage.querySelector('.toolbar-button[title="文字输入"]');

    let isTextMode = false;

    if (textTool) {
            textTool.addEventListener('click', (e) => {
                const wasInTextMode = textTool.classList.contains('active');

                if (wasInTextMode) {
                    isTextMode = false;
                    canvas.style.pointerEvents = 'auto';
                    textTool.classList.remove('active');
                    bakeTextOntoCanvas(canvas); // Pass canvas element
                } else {
                    isTextMode = true;
                    textTool.classList.add('active');
                    brushTool.classList.remove('active');
                    const canvasRect = canvas.getBoundingClientRect();
                    createTextArea(canvas, canvasRect.width / 2, canvasRect.height / 2);
                }
            });
        }

   function bakeTextOntoCanvas(canvasElement, text, x, y, color, fontSize, fontFamily)  {
        if (!canvasElement) return;
        const containers = canvasElement.parentElement.querySelectorAll('.textarea-container');
        containers.forEach(container => {
            const textarea = container.querySelector('.note-textarea');
            const text = textarea.value;
            if (text.trim() === '') {
                container.remove(); // Remove empty text areas
                return;
            }

            const x = container.offsetLeft;
            const y = container.offsetTop;
            const style = window.getComputedStyle(textarea);
            const fontSize = style.fontSize;
            const fontFamily = style.fontFamily;
            const color = style.color;
            const lineHeight = parseFloat(style.lineHeight) || (parseFloat(fontSize) * 1.2);
            const padding = parseFloat(style.padding) || 5;

            ctx.font = `${style.fontWeight} ${style.fontStyle} ${fontSize} ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.globalAlpha = 1;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const lines = text.split('\n');
            lines.forEach((line, index) => {
                ctx.fillText(line, x + padding, y + padding + (index * lineHeight));
            });

            // Remove the container after baking
            container.remove();
        });
        saveCanvasState(); // Save the state after baking
    }

    function createTextArea(canvasElement, x, y, text = '', width = 200, height = 100) {
        if (!canvasElement) {
            console.error("Canvas element is not provided. Cannot create text area.");
            return;
        }

        const container = document.createElement('div');
        container.className = 'textarea-container';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;

        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '&#x2630;'; // Hamburger icon for dragging
        container.appendChild(dragHandle);

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.className = 'note-textarea';
        container.appendChild(textarea);

        canvasElement.parentElement.appendChild(container);
         textarea.addEventListener('blur', () => {
            const textValue = textarea.value.trim();
            if (textValue !== '') {
                // Get text properties from the textarea
                const style = window.getComputedStyle(textarea);
                const color = style.color;
                const fontSize = style.fontSize;
                const fontFamily = style.fontFamily;
                const lineHeight = parseFloat(style.lineHeight) || (parseFloat(fontSize) * 1.2);

                // Bake the text onto the canvas
                bakeTextOntoCanvas(
                    canvasElement, 
                    textValue, 
                    container.offsetLeft + parseInt(style.paddingLeft, 10),
                    container.offsetTop + parseInt(style.paddingTop, 10) + lineHeight, // Adjust for baseline
                    color, 
                    fontSize, 
                    fontFamily
                );
            }
            // Remove the textarea container from the DOM
            container.remove();
        });

        let isDragging = false;
        let offsetX, offsetY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.cursor = 'grabbing';
            // Prevent text selection while dragging
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
                saveCanvasState();
            }
        });

        textarea.addEventListener('input', saveCanvasState);

        // Save state when resizing is done
        new ResizeObserver(saveCanvasState).observe(container);

        return container;
    }
}

// Make sure to call this function when the app initializes or when the handwriting page is shown.
// For example, you can add it to your main `DOMContentLoaded` listener.
document.addEventListener('DOMContentLoaded', initializeHandwritingPage);

// --- Note Detail Page Logic ---
const recentNotesList = document.querySelector('.recent-notes-grid');
// const noteDetailPage = document.getElementById('note-detail-page');
const mainPage = document.getElementById('main-page');
const fileManagerBtn = document.getElementById('file-manager-btn');
// const fileManagerPage = document.getElementById('file-manager-page');
const fileTypeFilterList = document.getElementById('file-type-filter-list');
if(fileTypeFilterList) {
    fileTypeFilterList.addEventListener('click', (e) => {
        // 检查点击的是否为过滤器项目
        const filterItem = e.target.closest('li.filter-item');
        if (!filterItem) return;

        try {
            // 移除所有项目的active类
            fileTypeFilterList.querySelectorAll('.filter-item').forEach(item => {
                item.classList.remove('active');
            });

            // 为点击项添加active类
            filterItem.classList.add('active');

            // 获取过滤类型
            const filter = filterItem.dataset.filter;
            if (!filter) {
                console.warn('未找到过滤器类型');
                return;
            }

            console.log('正在按以下类型过滤:', filter);
            // TODO: 实现renderFiles函数
            // renderFiles(filter);

        } catch (error) {
            console.error('文件类型过滤出错:', error);
        }
    });
}

    if (fileManagerBtn) {
        fileManagerBtn.addEventListener('click', () => {
            showPage('fileManagerPage');
        });
    }

if (recentNotesList) {
    recentNotesList.addEventListener('click', (e) => {
        const noteCard = e.target.closest('.note-card');
        if (noteCard) {
            const noteId = noteCard.dataset.id; // Assume note card has a data-id attribute
            openNoteDetailPage(noteId);
        }
    });
}

function openNoteDetailPage(noteId) {
    console.log('Opening note with ID:', noteId);
    const noteData = allNotesData.find(n => n.id == noteId);
    console.log('Found note data:', noteData);
    if (!noteData) {
        console.error('Note not found!');
        return;
    }

    // 1. Hide main page and show note detail page
    homePage.style.display = 'none';
    noteDetailPage.style.display = 'flex';

    // 2. Fetch note data using noteId (mockup)
     const titleInput = document.querySelector('#note-detail-page .note-title-input');
    const editorContainer = document.getElementById('editor-container');
    const tagsContainer = document.querySelector('#note-detail-page .note-tags-container');
    const createdDateEl = document.querySelector('#note-detail-page .note-dates span:first-child');

    // 3. Populate the page with note data
      if (titleInput) titleInput.value = noteData.title;
    if (createdDateEl) createdDateEl.textContent = new Date(noteData.date).toLocaleDateString();

    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        noteData.tags.forEach((tag, index) => {
            const tagEl = document.createElement('span');
            tagEl.className = `tag tag-color-${(index % 5) + 1}`;
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });
    }

    // 3. Handle content based on source
    if (editorContainer) {
        editorContainer.innerHTML = ''; // Clear previous content
        if (noteData.source === '手写' && noteData.image) {
            const img = document.createElement('img');
            img.src = noteData.image;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            editorContainer.appendChild(img);
        } else {
            // For non-handwriting notes, you would initialize your rich text editor here
            // For now, just display the text content.
            editorContainer.innerHTML = `<p>${noteData.content}</p>`;
        }
    }
    // ... populate tags, dates, and editor content

    // 4. Initialize a rich text editor (e.g., Quill.js) on #editor-container
    // initializeEditor(noteData.content);

    // 5. Add logic for editor content selection to trigger AI panel updates
    // editor.on('selection-change', (range) => { if(range) { updateAiPanel(editor.getText(range)); } });
}

// Add back button functionality
const backBtnDetail = document.querySelector('#note-detail-page .back-btn');
if (backBtnDetail) {
    backBtnDetail.addEventListener('click', () => {
        noteDetailPage.style.display = 'none';
        // Instead of directly manipulating style, use the showPage function for consistency
        showPage(homePage); 
    });
}


