import { AccountCategoryForm } from "./accountCategory.schema";

export const emptyAccountCategoryForm = (): AccountCategoryForm => ({
  id: 0,
  name: "",
  active: true,
});

/** GET /api/AccountCategory/GetCategory/{id} returns TblAccountCategory (camelCased). */
export const toAccountCategoryForm = (data: any): AccountCategoryForm => ({
  id: Number(data?.id || 0),
  name: data?.name ? String(data.name) : "",
  active: data?.active !== false,
});

/** Payload for POST /api/AccountCategory/addeditAccountCategory (AccountCategory). */
export const toAccountCategoryModel = (form: AccountCategoryForm) => ({
  id: Number(form.id || 0),
  name: form.name.trim(),
  active: Boolean(form.active),
});
