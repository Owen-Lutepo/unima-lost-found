import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('claimed_items')
export class Claim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  claimantPhone: string;

  @ManyToOne(() => User)
  claimant: User;

  @OneToOne(() => Item)
  @JoinColumn()
  item: Item;
}