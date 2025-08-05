import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorIngredient extends TIngredient {
  id: string;
}

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: ConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (
      state,
      action: PayloadAction<TIngredient | ConstructorIngredient>
    ) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        if ('id' in ingredient) {
          state.ingredients.push(ingredient as ConstructorIngredient);
        }
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];
      const [removed] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, removed);
      state.ingredients = ingredients;
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const addIngredientAction = (ingredient: TIngredient) => {
  if (ingredient.type === 'bun') {
    return constructorSlice.actions.addIngredient(ingredient);
  } else {
    const ingredientWithId: ConstructorIngredient = {
      ...ingredient,
      id: uuidv4()
    };
    return constructorSlice.actions.addIngredient(ingredientWithId);
  }
};

export const { removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export default constructorSlice.reducer;
