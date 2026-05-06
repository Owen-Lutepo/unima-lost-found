import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Security: Don't return password in GET requests
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar2', length: 10, nullable: true }) 
  verificationCode: string | null;

  // Relationship: One user can find many items
  @OneToMany(() => Item, (item) => item.founder)
  foundItems: Item[];
}
