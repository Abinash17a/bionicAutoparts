"use client";

import React from "react";
import { ObfuscatedEmail } from "../components/ProtectedEmail";

export default function Refunds() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Returns and Refunds Policy</h1>
      <div className="space-y-6 text-gray-800">
        <section>
          <h2 className="text-xl font-semibold mb-2">How do I return a part? How do I get a refund?</h2>
          <p className="text-xl mb-2">
            As a part of our money-back guarantee, we want you to be completely satisfied with your purchase. If you wish to return a part, please follow the return policy guidelines below.
          </p>
          <p className="text-xl mb-2">
            Email <ObfuscatedEmail className="text-blue-600 underline">parts@bionicsautoparts.com</ObfuscatedEmail> or call <a href="tel:16173907248" className="text-blue-600 underline">(617) 390-7248</a> Monday through Friday, 8:00 a.m. to 5:00 p.m. Eastern Time to request a return authorization (RA) number. We cannot process returns that do not include an RA number.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Damaged Shipments</h2>
          <p className="text-xl mb-2">
            It is extremely important that you inspect your shipment thoroughly before accepting and signing for the merchandise. Even though the box and packaging may be intact, it is possible the product could have arrived damaged. If a part does arrive damaged, please accept the delivery and contact Customer Service immediately at <a href="tel:16173907248" className="text-blue-600 underline">(617) 390-7248</a>. Proof of damage may be provided by photos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Freight Shipments and UPS Ground Shipments</h2>
          <p className="text-xl mb-2">
            <strong>Freight Shipments:</strong> Before accepting delivery, check for both internal and external damage. Remove the product from its packaging and inspect for damage. If you notice damage, please call our Customer Service immediately at <a href="tel:16173907248" className="text-blue-600 underline">(617) 390-7248</a> after accepting the delivery to obtain a return authorization number.
          </p>
          <p className="text-xl mb-2">
            For engine assemblies, please be advised that we do not warranty or guarantee any attached accessory parts in the sale, such as switches, sensors, cables, electronics, belts, hoses, water pumps, and manifolds. Because such parts are not warrantied, refusal of delivery for these parts being damaged will result in deduction of original shipping and handling charges from any refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Returning Defective or Incorrect Parts</h2>
          <p className="text-xl mb-2">
            If you received an incorrect or defective part, you may return it for an exchange or replacement. Please contact Customer Service to explain the problem. We will create a new order for the part and issue an RA for the original part.
          </p>
          <p className="text-xl mb-2">
            BionicsAutoParts will ship the replacement part as soon as freight charges have been paid for the returned part and the part is on its way back to us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Refused Shipment or Failed Delivery</h2>
          <p className="text-xl mb-2">
            If you have refused delivery of your shipment, please contact Customer Service immediately at <a href="tel:16173907248" className="text-blue-600 underline">(617) 390-7248</a>. Shipped items that are either refused by the customer or are unable to be delivered due to continual failed delivery attempts will be returned to BionicsAutoParts, and you will be credited the amount of the sale, not including shipping and handling. Please allow up to 14 business days for a credit to be issued. It is your responsibility to make immediate and adequate arrangements with the shipping company to accept a shipment in the event of a failed delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">BionicsAutoParts Discretion</h2>
          <p className="text-xl mb-2">
            BionicsAutoParts reserves the right to deny any exchange or return request. Please do not install damaged or incorrectly shipped items, as doing so will void our return policy. Any parts that have been modified, installed, or damaged in any way by the customer may result in denial of a refund and/or exchange request.
          </p>
          <p className="text-xl mb-2">
            Customer Service will provide you with the shipping address to send the returned item. You must include the RA number on the shipping label.
          </p>
          <p className="text-xl mb-2">
            Returned parts must be in "as new" condition and shipped in their original packages and shipping cartons. If the original carton is not available, the part must be packaged correctly to ensure safe shipping. We cannot issue a credit for items that return to our facility damaged, or for items that have been partially or fully installed or painted. Proper shipping and associated cost is the responsibility of the customer.
            The original invoice, or a copy, must be included with the item.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Return Window & Refund Processing</h2>
          <p className="text-xl mb-2">
            Our return policy provides 30 days from the date of the original invoice to return items.
            Refunds will be issued once we have received, inspected, and processed the part(s). Original shipping charges will be deducted from the refund amount. Exceptions will apply for parts that were received damaged or stocked incorrectly.
          </p>
          <p className="text-xl mb-2">
            All refunds will be processed once merchandise has been returned to BionicsAutoParts. Please allow 5-7 business days for the refund to be posted to your account.
          </p>
        </section>
      </div>
    </div>
  );
}

