namespace Entidades
{
    export class Mascota
    {
        protected tamanio : string;
        protected edad : number;
        protected precio : number;

        public constructor(tamanio:string,edad:number,precio:number)
        {
            this.tamanio = tamanio;
            this.edad = edad;
            this.precio = precio;
        }
        public ToString():string
        {
            return '{"tamanio" : "' + this.tamanio +  '" , "edad" : ' + this.edad + ' , "precio" : ' + this.precio  + ',' ;
        }
    }
    export class Perro extends Mascota
    {
        public nombre : string;
        public raza : string;
        public pathFoto : string;

        public constructor(tamanio:string,edad:number,precio:number,nombre:string,raza:string,pathFoto:string)
        {
            super(tamanio,edad,precio);
            this.nombre = nombre;
            this.raza = raza;
            this.pathFoto = pathFoto;
        }
        public ToJson() : JSON
        {
            let datos = this.ToString() + '"nombre" : "' + this.nombre + '" , "raza" : "' + this.raza + '" , "pathFoto" : "' + this.pathFoto + '" }';
            return JSON.parse(datos);
        }
    }
    export interface IParte2
    {
        EliminarPerro(obJson:any) :void;
        ModificarPerro(obJson:any):void;


    }


}