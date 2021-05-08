import {
    Brand,
    Country,
    DeliveryMethod,
    Invoice,
    OfferCatalog,
    Order,
    PaymentMethod,
    Product,
} from '@opennetwork/environments-schema-org-logistics';
import { createFragment, h } from "@opennetwork/vnode";

export const SiteContents = (
  <>
      <OfferCatalog>
          <Product
            name="This is my name 1"
            sku="SKU 123"
          >
              <Brand name="Some brand" />
          </Product>
          <Product
            name="This is my name 2"
            sku="SKU 124"
          >
              <Brand name="Some brand" />
          </Product>
          <Product
            name="This is my name 3"
            sku="SKU 125"
          >
              <Brand name="Some other brand" />
          </Product>
      </OfferCatalog>
      <Order
        identifier="1"
        orderDate={new Date()}
      >
          <Invoice identifier="2313132">
              <PaymentMethod identifier="123243234" />
          </Invoice>
          <Product
            sku="SKU 125"
          />
          <DeliveryMethod identifier="123122222">
              <Country name="New Zealand" />
          </DeliveryMethod>
      </Order>
  </>
);
