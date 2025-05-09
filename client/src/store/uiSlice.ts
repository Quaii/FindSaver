import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isScraperModalOpen: boolean;
  isCollectionModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  itemToDelete: string | null;
  collectionToDelete: string | null;
  activeCollection: string | null;
  searchQuery: string;
}

const initialState: UiState = {
  isScraperModalOpen: false,
  isCollectionModalOpen: false,
  isDeleteConfirmOpen: false,
  itemToDelete: null,
  collectionToDelete: null,
  activeCollection: null,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openScraperModal: (state) => {
      state.isScraperModalOpen = true;
    },
    closeScraperModal: (state) => {
      state.isScraperModalOpen = false;
    },
    openCollectionModal: (state) => {
      state.isCollectionModalOpen = true;
    },
    closeCollectionModal: (state) => {
      state.isCollectionModalOpen = false;
    },
    openDeleteConfirm: (state, action: PayloadAction<{ type: 'item' | 'collection', id: string }>) => {
      state.isDeleteConfirmOpen = true;
      if (action.payload.type === 'item') {
        state.itemToDelete = action.payload.id;
      } else {
        state.collectionToDelete = action.payload.id;
      }
    },
    closeDeleteConfirm: (state) => {
      state.isDeleteConfirmOpen = false;
      state.itemToDelete = null;
      state.collectionToDelete = null;
    },
    setActiveCollection: (state, action: PayloadAction<string | null>) => {
      state.activeCollection = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  openScraperModal,
  closeScraperModal,
  openCollectionModal,
  closeCollectionModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  setActiveCollection,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer;