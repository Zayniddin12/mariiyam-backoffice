import { defineStore } from "pinia";
import ApiService from "@/services/ApiService";

export const useBooksStore = defineStore("booksStore", {
  state: () => ({
    book: {},
    transactions: {},
    count: 0,
    loading: false,
    transactionsLoading: false,
  }),
  actions: {
    fetchSingleBook(id: string) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        ApiService.get(`/backoffice/Books/${id}`)
          .then((res) => {
            this.book = res.data;
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    fetchTransaction(
      id: string,
      params: {
        page: number;
        page_size: number;
        search: string;
        provider: string;
        start_date: string;
        end_date: string;
      }
    ) {
      this.transactionsLoading = true;
      return new Promise((resolve, reject) => {
        ApiService.query(`backoffice/Book/TransactionsList/${id}/`, {
          params,
        })
          .then((res) => {
            this.transactions = res?.data?.results;
            this.count = res?.data?.count;
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.transactionsLoading = false;
          });
      });
    },
  },
});
