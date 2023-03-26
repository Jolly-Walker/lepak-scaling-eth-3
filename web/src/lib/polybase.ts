import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";

export const db = new Polybase({
  defaultNamespace:
    "pk/0x9da305e55348cf8d703b6da1901e571f7cd627883194701082966a0c17f7c827c6ceb6e6a7425bf0fcefde5fddcc9941dd9f572e8c8f1be0108669e630a4b380/recrruipay",
  signer: (data) => ({
    h: "eth-personal-sign",
    // random value :/
    sig: ethPersonalSign(
      "0x042c25573750b71b6d38C997654e43B3233F8E4D00042c25573750b71b6d38CF",
      data
    ),
  }),
});

export const payments = db.collection("RecurringPayment");

// const res = db.applySchema(`
//   @public
//   collection RecurringPayment {
//     id: string;
//     addrFrom: string;
//     addrTo: string;
//     amount: number;
//     frequency: string; // weekly | montly
//     date: string;
//
//     constructor (id: string, addrFrom: string, addrTo: string, amount: number, frequency: string, date: string) {
//       this.id = id;
//       this.addrFrom = addrFrom;
//       this.addrTo = addrTo;
//       this.amount = amount;
//       this.frequency = frequency;
//       this.date = date;
//     }
//
//   }
// `)
