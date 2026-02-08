import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopService {
    constructor(private prisma: PrismaService) { }

    // --- Product Management (Admin) ---

    async createProduct(data: any) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
                images: data.images || [], // Array of URLs
                category: data.category,
                stock: parseInt(data.stock) || 0,
                variants: data.variants || [], // JSON
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
            }
        });
    }

    async updateProduct(id: string, data: any) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                price: data.price ? parseFloat(data.price) : undefined,
                salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
                stock: data.stock ? parseInt(data.stock) : undefined,
            }
        });
    }

    async deleteProduct(id: string) {
        return this.prisma.product.delete({
            where: { id }
        });
    }

    // --- Product Browsing (User) ---

    async findAllProducts(query: any) {
        const { category, search } = query;
        const whereClause: any = { isAvailable: true };

        if (category) {
            whereClause.category = category;
        }

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.product.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOneProduct(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    // --- Order Management ---

    async createOrder(userId: string, data: any) {
        const { items, shippingAddress } = data;
        let totalAmount = 0;

        // Calculate total and prepare items
        const orderItemsData: Array<{
            productId: string;
            quantity: number;
            price: number;
            variant?: string;
        }> = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

            const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
            totalAmount += price * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price,
                variant: item.variant // e.g. "Size: M"
            });
        }

        const order = await this.prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: 'PENDING',
                shippingAddress: shippingAddress, // JSON
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });

        return order;
    }

    async getUserOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    // --- Admin Analytics ---
    async getShopStats() {
        const totalOrders = await this.prisma.order.count();
        const totalRevenue = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'PAID' } // Only count paid orders
        });

        const orders = await this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { user: { select: { name: true, phone: true } } }
        });

        return {
            totalOrders,
            revenue: totalRevenue._sum.totalAmount || 0,
            recentOrders: orders
        };
    }
}
