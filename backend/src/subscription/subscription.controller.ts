import { Controller, Get, Post, Delete, UseGuards, Req, Param, Res, Body, NotFoundException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard';
import { Response } from 'express';
import { InvoiceService } from '../invoice/invoice.service';
import { PrismaService } from '../prisma.service';

@Controller('api/subscription')
@UseGuards(AuthGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly invoiceService: InvoiceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getStats(@Req() req: AuthenticatedRequest) {
    return this.subscriptionService.getUsageStats(req.user.id);
  }

  @Post('upgrade')
  async upgrade(@Req() req: AuthenticatedRequest, @Body() paymentInfo: any) {
    return this.subscriptionService.upgradeToPro(req.user.id, paymentInfo);
  }

  @Post('downgrade')
  async downgrade(@Req() req: AuthenticatedRequest) {
    return this.subscriptionService.downgradeToFree(req.user.id);
  }

  @Delete('account')
  async deleteAccount(@Req() req: AuthenticatedRequest) {
    return this.subscriptionService.deleteAccount(req.user.id);
  }

  @Get('invoices')
  async getInvoices(@Req() req: AuthenticatedRequest) {
    return this.subscriptionService.getInvoices(req.user.id);
  }

  @Get('invoices/:id/pdf')
  async downloadInvoice(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!invoice || invoice.customerId !== req.user.id) {
      throw new NotFoundException('Invoice not found');
    }

    const pdfBuffer = await this.invoiceService.generateInvoicePdf(invoice, invoice.customer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
