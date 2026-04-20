import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoiceService {
  private logger = new Logger(InvoiceService.name);

  async generateInvoicePdf(invoice: any, customer: any): Promise<Buffer> {
    try {
      const templatePath = path.join(process.cwd(), 'src/invoice/templates/invoice.hbs');
      const templateHtml = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateHtml);

      const data = {
        invoiceId: `INV-${new Date(invoice.date).getFullYear()}-${invoice.id.slice(0, 8).toUpperCase()}`,
        date: new Date(invoice.date).toLocaleDateString(),
        customerEmail: customer.email,
        amount: invoice.amount.toFixed(2),
        isTrial: invoice.amount === 0,
        items: [
          {
            description: invoice.amount === 0 ? 'ZenOTA Professional Plan — 1 Month Trial' : 'ZenOTA Professional Plan — 1 Month',
            price: invoice.amount.toFixed(2),
          }
        ]
      };

      const html = template(data);

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error('Failed to generate invoice PDF', error);
      throw error;
    }
  }
}
