import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('items')
export class Item {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'clob' }) // Large text for Base64 images
  description: string;

  @Index() 
  @Column()
  category: string;

  @Column({ type: 'clob' }) 
  image: string;

  @Column({ default: 'available' }) // 'available' | 'claimed'
  status: string;

  // Relationship: The person who found it
  @ManyToOne(() => User, (user) => user.foundItems)
  founder: User;
}